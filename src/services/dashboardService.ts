import {
  Staff,
  TimeLog,
  BreakRecord,
  BreakType,
} from '@//types';

import { format, parseISO } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

let staffData: Staff[] = []; // This will be the fake database

// Helper for calculating difference, as it's used in a few places
const differenceInMilliseconds = (dateLeft: Date, dateRight: Date): number => {
  return dateLeft.getTime() - dateRight.getTime();
};

// Simulating Utility Services
export const getStaffById = async (id: string): Promise<Staff> => {
  if (!staffData.length) {
    const response = await fetch('/data/staffs.json');
    const json = await response.json();
    staffData = json.staffs;
  }

  const staff = staffData.find((member) => member.id === id);
  if (!staff) throw new Error(`Staff with id ${id} not found`);
  return staff;
};

export const updateStaffData = async (
  id: string,
  updatedData: Staff
): Promise<Staff> => {
  const index = staffData.findIndex((member) => member.id === id);
  if (index === -1) throw new Error(`Staff with id ${id} not found`);

  staffData[index] = updatedData;
  return updatedData;
};

// Simulating Action Services
export const clockInService = async (userId: string): Promise<TimeLog> => {
  const currentData = await getStaffById(userId);
  const now = new Date();
  const todayDateStr = format(now, 'yyyy-MM-dd');

  // Check if already clocked in today
  const existingLogToday = currentData.timeLogs.find(
    (log) => log.date === todayDateStr && !log.clockOutTime
  );
  if (existingLogToday) {
    // This case should ideally be prevented by UI logic, but as a safeguard:
    console.warn(
      'ClockInService: Already clocked in today or log exists without clockout.'
    );
    return existingLogToday; // Or throw an error: throw new Error("Already clocked in today.");
  }

  const newLog: TimeLog = {
    id: uuidv4(),
    date: todayDateStr,
    clockInTime: now.toISOString(),
    clockOutTime: null,
    breaks: [],
    totalWorkMs: 0, // Will be calculated on clock out or dynamically
    totalBreakMs: 0, // Will be calculated
  };

  const updatedLogs = [...currentData.timeLogs, newLog];
  await updateStaffData(userId, { ...currentData, timeLogs: updatedLogs });
  return newLog;
};

export const clockOutService = async (
  userId: string,
  logId: string
): Promise<TimeLog> => {
  const currentData = await getStaffById(userId);
  const now = new Date();
  let updatedLog: TimeLog | undefined;

  const updatedLogs = currentData.timeLogs.map((log) => {
    if (log.id === logId && !log.clockOutTime) {
      // Calculate total work and break time for this log before clocking out
      const clockInDate = parseISO(log.clockInTime);
      let totalWorkMs = differenceInMilliseconds(now, clockInDate);
      let totalBreakMs = 0;
      log.breaks.forEach((br) => {
        if (br.startTime && br.endTime) {
          totalBreakMs += differenceInMilliseconds(
            parseISO(br.endTime),
            parseISO(br.startTime)
          );
        }
      });
      totalWorkMs -= totalBreakMs; // Subtract total break time from gross work time

      updatedLog = {
        ...log,
        clockOutTime: now.toISOString(),
        totalWorkMs: totalWorkMs > 0 ? totalWorkMs : 0,
        totalBreakMs: totalBreakMs,
      };
      return updatedLog;
    }
    return log;
  });

  if (!updatedLog) {
    throw new Error(
      `ClockOutService: Log ID ${logId} not found or already clocked out.`
    );
  }

  await updateStaffData(userId, { ...currentData, timeLogs: updatedLogs });
  return updatedLog;
};

export const startBreakService = async (
  userId: string,
  logId: string,
  breakType: BreakType
): Promise<BreakRecord> => {
  const currentData = await getStaffById(userId);
  const now = new Date();
  let newBreakRecord: BreakRecord | undefined;
  let targetLog: TimeLog | undefined;

  const updatedLogs = currentData.timeLogs.map((log) => {
    if (
      log.id === logId &&
      !log.clockOutTime &&
      !log.breaks.find((b) => !b.endTime)
    ) {
      // Ensure clocked in and not already on break
      targetLog = log;
      newBreakRecord = {
        id: uuidv4(),
        startTime: now.toISOString(),
        type: breakType,
        endTime: null, // Mark as ongoing
      };
      return { ...log, breaks: [...log.breaks, newBreakRecord] };
    }
    return log;
  });

  if (!newBreakRecord || !targetLog) {
    throw new Error(
      `StartBreakService: Cannot start break. Log ID ${logId} not found, already on break, or clocked out.`
    );
  }

  await updateStaffData(userId, { ...currentData, timeLogs: updatedLogs });
  return newBreakRecord;
};

export const endBreakService = async (
  userId: string,
  logId: string,
  breakId: string
): Promise<BreakRecord> => {
  const currentData = await getStaffById(userId);
  const now = new Date();
  let endedBreakRecord: BreakRecord | undefined;

  const updatedLogs = currentData.timeLogs.map((log) => {
    if (log.id === logId) {
      const updatedBreaks = log.breaks.map((br) => {
        if (br.id === breakId && !br.endTime) {
          endedBreakRecord = {
            ...br,
            endTime: now.toISOString(),
            durationMs: differenceInMilliseconds(now, parseISO(br.startTime)),
          };
          return endedBreakRecord;
        }
        return br;
      });
      // Recalculate totalBreakMs for the log
      const totalBreakMs = updatedBreaks.reduce((sum, currentBreak) => {
        return sum + (currentBreak.durationMs || 0);
      }, 0);

      return { ...log, breaks: updatedBreaks, totalBreakMs };
    }
    return log;
  });

  if (!endedBreakRecord) {
    throw new Error(
      `EndBreakService: Break ID ${breakId} on Log ID ${logId} not found or already ended.`
    );
  }

  await updateStaffData(userId, { ...currentData, timeLogs: updatedLogs });
  return endedBreakRecord;
};
