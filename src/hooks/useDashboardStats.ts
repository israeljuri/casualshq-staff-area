'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getStaffById,
  clockInService,
  clockOutService,
  startBreakService,
  endBreakService,
} from '../services/dashboard.service'; // Assuming path is correct
import {
  Staff,
  BreakRecord,
  BreakType,
  ActiveSessionState,
} from '@/types';
import {
  parseISO,
  format,
  differenceInMilliseconds as dateFnsDifferenceInMilliseconds,
  isToday,
  isSameDay,
  subDays,
  startOfDay,
  endOfDay,
  addDays,
} from 'date-fns';
import useAlert from '@/hooks/useAlert';

export const useDashboardStats = (
  userId: string,
  initialSelectedDate: Date = new Date()
) => {
  const queryClient = useQueryClient();
  const alert = useAlert();

  // States
  const [selectedDate, setSelectedDate] = useState<Date>(
    startOfDay(initialSelectedDate)
  );
  const [workTimer, setWorkTimer] = useState<number>(0);
  const [breakTimer, setBreakTimer] = useState<number>(0);
  const [activeSession, setActiveSession] = useState<ActiveSessionState>({
    isActive: false,
    isOnBreak: false,
    currentWorkSegmentStart: null,
    currentBreakRecord: null,
    todaysLog: null,
  });

  const {
    data: staffData,
    isLoading: isLoadingData,
    error: dataError,
  } = useQuery<Staff, Error>({
    queryKey: ['staffData'],
    queryFn: () => getStaffById(userId),
    staleTime: 1000 * 60 * 1, // 1 minute for more frequent updates if needed during dev
    refetchOnWindowFocus: true,
  });

  // Effects

  // to initialize or update activeSession based on fetched data and selectedDate
  useEffect(() => {
    if (!staffData) {
      setActiveSession({
        // Reset if no staff data
        isActive: false,
        isOnBreak: false,
        currentWorkSegmentStart: null,
        currentBreakRecord: null,
        todaysLog: null,
      });
      return;
    }

    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const logForSelectedDate = staffData.timeLogs.find(
      (log) => log.date === dateStr
    );

    if (isToday(selectedDate)) {
      if (logForSelectedDate) {
        const isActive = !logForSelectedDate.clockOutTime;
        const ongoingBreak = isActive
          ? logForSelectedDate.breaks.find((b) => b.startTime && !b.endTime)
          : null;

        setActiveSession({
          isActive: isActive,
          isOnBreak: !!ongoingBreak,
          currentWorkSegmentStart:
            isActive && !ongoingBreak ? new Date() : null, // Resume timer if app just loaded and working
          currentBreakRecord: ongoingBreak ? { ...ongoingBreak } : null,
          todaysLog: { ...logForSelectedDate },
        });
      } else {
        // No log for today yet
        setActiveSession({
          isActive: false,
          isOnBreak: false,
          currentWorkSegmentStart: null,
          currentBreakRecord: null,
          todaysLog: null,
        });
      }
    } else {
      // For past dates, session is never "active" in terms of live tracking
      setActiveSession({
        isActive: false,
        isOnBreak: false,
        currentWorkSegmentStart: null,
        currentBreakRecord: null,
        todaysLog: logForSelectedDate || null, // Show historical log if exists
      });
    }
    setWorkTimer(0);
    setBreakTimer(0);
  }, [selectedDate, staffData]);

  // Timer logic
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (activeSession.isActive && isToday(selectedDate)) {
      if (!activeSession.isOnBreak && activeSession.currentWorkSegmentStart) {
        intervalId = setInterval(
          () =>
            setWorkTimer(
              calculateCurrentSegmentDuration(
                activeSession.currentWorkSegmentStart
              )
            ),
          1000
        );
      } else if (
        activeSession.isOnBreak &&
        activeSession.currentBreakRecord?.startTime
      ) {
        intervalId = setInterval(
          () =>
            setBreakTimer(
              calculateCurrentSegmentDuration(
                parseISO(activeSession.currentBreakRecord!.startTime)
              )
            ),
          1000
        );
      }
    }
    return () => clearInterval(intervalId);
  }, [
    activeSession.isActive,
    activeSession.isOnBreak,
    activeSession.currentWorkSegmentStart,
    activeSession.currentBreakRecord,
    selectedDate,
  ]);

  const selectedDayLog = useMemo(() => {
    // This will now primarily reflect the data from staffData (localStorage)
    // activeSession.todaysLog is more for the *live construction* of today's log
    if (!staffData) return null;

    return (
      staffData.timeLogs.find((log) =>
        isSameDay(parseISO(log.date), selectedDate)
      ) || null
    );
  }, [staffData, selectedDate]);

  const statsForSelectedDate = useMemo(() => {
    const log = selectedDayLog; // Use the log from potentially updated staffData
    if (!log) {
      return { clockedInAt: null, totalWorkMs: 0, totalBreakMs: 0 };
    }

    let currentTotalWorkMs = 0;
    const currentTotalBreakMs = calculateTotalBreakDurationForLog(log.breaks);

    if (log.clockInTime) {
      const clockInDate = parseISO(log.clockInTime);
      const clockOutOrNow = log.clockOutTime
        ? parseISO(log.clockOutTime)
        : new Date();

      if (log.clockOutTime) {
        // If clocked out, use stored totalWorkMs or calculate
        currentTotalWorkMs =
          log.totalWorkMs ||
          differenceInMs(clockOutOrNow, clockInDate) - currentTotalBreakMs;
      } else if (isToday(selectedDate) && activeSession.isActive) {
        // Actively clocked in today
        // Calculate work up to the start of the current segment (if any) from the log's breaks
        // then add the live timer.
        // A simpler approach for live: total time since clock-in, minus total breaks (completed + current live break)
        const grossTimeSinceClockIn = differenceInMs(new Date(), clockInDate);
        let liveTotalBreakMs = currentTotalBreakMs;
        if (activeSession.isOnBreak) {
          liveTotalBreakMs += breakTimer; // Add live break timer
        }
        currentTotalWorkMs = grossTimeSinceClockIn - liveTotalBreakMs;

        // Add current work timer if not on break
        if (!activeSession.isOnBreak) {
          // This part is tricky: workTimer is for the *current segment*.
          // The total work should be sum of past segments + current segment.
          // Let's rely on the gross calculation above for live total work.
          // The `workTimer` itself is mostly for displaying the *current segment's* duration if needed.
        }
      } else {
        // Log from past, not clocked out (data issue) or not today
        currentTotalWorkMs = log.totalWorkMs || 0; // Use stored or assume 0 if incomplete
      }
    }

    return {
      clockedInAt: log.clockInTime
        ? format(parseISO(log.clockInTime), 'p')
        : null,
      totalWorkMs: Math.max(0, currentTotalWorkMs),
      totalBreakMs:
        currentTotalBreakMs +
        (isToday(selectedDate) && activeSession.isOnBreak ? breakTimer : 0),
    };
  }, [selectedDayLog, activeSession, workTimer, breakTimer, selectedDate]);

  const weekHistory = useMemo(() => {
    if (!staffData) return [];
    const endDate = startOfDay(selectedDate);
    const startDate = subDays(endDate, 6);

    return staffData.timeLogs
      .filter((log) => {
        const logDateInstance = startOfDay(parseISO(log.date));
        return logDateInstance >= startDate && logDateInstance <= endDate;
      })
      .map((log) => {
        const totalBreakMs = calculateTotalBreakDurationForLog(log.breaks);
        let totalWorkMs = 0;
        if (log.clockInTime && log.clockOutTime) {
          totalWorkMs =
            differenceInMs(log.clockOutTime, log.clockInTime) - totalBreakMs;
        } else if (
          log.clockInTime &&
          !log.clockOutTime &&
          isSameDay(parseISO(log.date), selectedDate) &&
          isToday(selectedDate)
        ) {
          // If it's today's active log, use live stats
          totalWorkMs = statsForSelectedDate.totalWorkMs;
        } else {
          totalWorkMs = log.totalWorkMs || 0; // Use stored if available for past incomplete logs
        }
        return {
          ...log,
          totalWorkMs: Math.max(0, totalWorkMs),
          totalBreakMs,
        };
      })
      .sort((a, b) => differenceInMs(b.date, a.date));
  }, [staffData, selectedDate, statsForSelectedDate]);

  const hoursWorkedThisWeek = useMemo(() => {
    if (!staffData) return 0;
    const weekStart = startOfDay(
      subDays(
        selectedDate,
        parseISO(format(selectedDate, 'yyyy-MM-dd') + 'T00:00:00Z').getDay()
      )
    );
    const weekEnd = endOfDay(addDays(weekStart, 6));
    let totalMs = 0;

    staffData.timeLogs.forEach((log) => {
      const logDateInstance = parseISO(log.date);
      if (logDateInstance >= weekStart && logDateInstance <= weekEnd) {
        if (
          isSameDay(logDateInstance, selectedDate) &&
          isToday(selectedDate) &&
          activeSession.isActive
        ) {
          // For today's active log, use the live calculated totalWorkMs
          totalMs += statsForSelectedDate.totalWorkMs;
        } else if (log.clockInTime && log.clockOutTime) {
          const breaksDuration = calculateTotalBreakDurationForLog(log.breaks);
          totalMs +=
            differenceInMs(log.clockOutTime, log.clockInTime) - breaksDuration;
        } else if (log.totalWorkMs) {
          totalMs += log.totalWorkMs; // Use pre-calculated for past days if available
        }
      }
    });
    return Math.max(0, totalMs);
  }, [
    staffData,
    selectedDate,
    activeSession.isActive,
    statsForSelectedDate.totalWorkMs,
  ]);

  // Mutations
  const clockInMutation = useMutation({
    mutationFn: () => clockInService(staffData?.id || '1'), // Pass actual userId if available
    onSuccess: (newLog) => {
      queryClient.invalidateQueries({ queryKey: ['staffData'] });
      // activeSession state will be updated by the useEffect watching staffData
      // Or, can optimistically update activeSession here for even faster UI response before refetch completes
      const now = new Date();
      setActiveSession({
        isActive: true,
        isOnBreak: false,
        currentWorkSegmentStart: now,
        currentBreakRecord: null,
        todaysLog: newLog,
      });
      setWorkTimer(0);
    },
    onError: (error) => {
      console.error('Clock In Error:', error);
      alert.showAlert(error.name, 'error', {
        subtext: error.message,
      });
    },
  });

  const clockOutMutation = useMutation({
    mutationFn: () => {
      if (!activeSession.todaysLog?.id)
        throw new Error('No active log to clock out from.');
      return clockOutService(
        staffData?.id || 'defaultUser',
        activeSession.todaysLog.id
      );
    },
    onSuccess: (updatedLog) => {
      queryClient.invalidateQueries({ queryKey: ['staffData'] });
      setActiveSession((prev) => ({
        ...prev,
        isActive: false,
        isOnBreak: false,
        currentWorkSegmentStart: null,
        todaysLog: updatedLog, // Reflect the clocked-out log
      }));
      setWorkTimer(0);
      alert.showAlert('Clock out Successful', 'success', {
        subtext: "You've succesfully clocked out",
      });
    },
    onError: (error) => {
      console.error('Clock Out Error:', error);
      alert.showAlert(error.name, 'error', {
        subtext: error.message,
      });
    },
  });

  const startBreakMutation = useMutation({
    mutationFn: (breakType: BreakType) => {
      if (!activeSession.todaysLog?.id)
        throw new Error('No active log to start break on.');
      return startBreakService(
        staffData?.id || 'defaultUser',
        activeSession.todaysLog.id,
        breakType
      );
    },
    onSuccess: (newBreakRecord) => {
      queryClient.invalidateQueries({ queryKey: ['staffData'] });
      // Optimistic update for UI responsiveness
      setActiveSession((prev) => ({
        ...prev,
        isOnBreak: true,
        currentBreakRecord: newBreakRecord,
        currentWorkSegmentStart: null, // Work is paused
        // todaysLog will be updated via refetch, or could be updated optimistically too
      }));
      setBreakTimer(0);
      setWorkTimer(0); // Current work segment ended
    },
    onError: (error) => {
      console.error('Start Break Error:', error);
      alert.showAlert(error.name, 'error', {
        subtext: error.message,
      });
    },
  });

  const endBreakMutation = useMutation({
    mutationFn: () => {
      if (
        !activeSession.todaysLog?.id ||
        !activeSession.currentBreakRecord?.id
      ) {
        throw new Error('No active break to end.');
      }
      return endBreakService(
        staffData?.id || 'defaultUser',
        activeSession.todaysLog.id,
        activeSession.currentBreakRecord.id
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffData'] });
      setActiveSession((prev) => ({
        ...prev,
        isOnBreak: false,
        currentBreakRecord: null,
        currentWorkSegmentStart: new Date(), // Resume work
      }));
      setBreakTimer(0);
    },
    onError: (error) => {
      console.error('End Break Error:', error);
      alert.showAlert(error.name, 'error', {
        subtext: error.message,
      });
    },
  });

  //   Action Handlers
  const handleClockIn = useCallback(() => {
    if (!isToday(selectedDate) || activeSession.isActive) return;
    clockInMutation.mutate();
  }, [selectedDate, activeSession.isActive, clockInMutation]);

  const handleClockOut = useCallback(() => {
    if (
      !activeSession.isActive ||
      !activeSession.todaysLog ||
      !isToday(selectedDate)
    )
      return;
    clockOutMutation.mutate();
  }, [activeSession, selectedDate, clockOutMutation]);

  const handleStartBreak = useCallback(
    (breakType: BreakType) => {
      if (
        !activeSession.isActive ||
        activeSession.isOnBreak ||
        !activeSession.todaysLog ||
        !isToday(selectedDate)
      )
        return;
      startBreakMutation.mutate(breakType);
    },
    [activeSession, selectedDate, startBreakMutation]
  );

  const handleEndBreak = useCallback(() => {
    if (
      !activeSession.isActive ||
      !activeSession.isOnBreak ||
      !activeSession.currentBreakRecord ||
      !isToday(selectedDate)
    )
      return;
    endBreakMutation.mutate();
  }, [activeSession, selectedDate, endBreakMutation]);

  return {
    selectedDate,
    setSelectedDate: (date: Date | undefined) =>
      date && setSelectedDate(startOfDay(date)),
    isLoading:
      isLoadingData ||
      clockInMutation.isPending ||
      clockOutMutation.isPending ||
      startBreakMutation.isPending ||
      endBreakMutation.isPending,
    error:
      dataError ||
      clockInMutation.error ||
      clockOutMutation.error ||
      startBreakMutation.error ||
      endBreakMutation.error,
    staffData,
    statsForSelectedDate,
    hoursWorkedThisWeek,
    weekHistory,
    activeSession,
    workTimerMs: workTimer,
    breakTimerMs: breakTimer,
    handleClockIn,
    handleClockOut,
    handleStartBreak,
    handleEndBreak,
    isTodaySelected: isToday(selectedDate),
    breakTypes: staffData?.breakTypes || [
      'Recess',
      'Coffee break',
      'Long break',
    ],
    isMutating:
      clockInMutation.isPending ||
      clockOutMutation.isPending ||
      startBreakMutation.isPending ||
      endBreakMutation.isPending,
  };
};

// Helper for consistent date diff
const differenceInMs = (
  dateLeft: Date | string,
  dateRight: Date | string
): number => {
  const dLeft = typeof dateLeft === 'string' ? parseISO(dateLeft) : dateLeft;
  const dRight =
    typeof dateRight === 'string' ? parseISO(dateRight) : dateRight;
  return dateFnsDifferenceInMilliseconds(dLeft, dRight);
};

const calculateTotalBreakDurationForLog = (breaks: BreakRecord[]): number => {
  return breaks.reduce((total, br) => {
    if (br.startTime && br.endTime) {
      return total + differenceInMs(br.endTime, br.startTime);
    }
    return total;
  }, 0);
};

const calculateCurrentSegmentDuration = (startTime: Date | null): number => {
  if (!startTime) return 0;
  return differenceInMs(new Date(), startTime);
};
