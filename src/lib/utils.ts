import {
  addDays,
  addMinutes,
  compareDesc,
  format,
  format as formatFns,
  intervalToDuration,
  isSameDay,
  parseISO,
  startOfWeek,
} from 'date-fns';

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { addWeeks, addMonths} from 'date-fns';
import { BreakSession, Timesheet } from '@/types/dashboard';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTime = (
  date: Date | string,
  formatStr: string = 'p'
): string => {
  if (typeof date === 'string') {
    return formatFns(parseISO(date), formatStr);
  }
  return formatFns(date, formatStr);
};

export const formatHoursMinutesFromMs = (milliseconds: number): string => {
  if (isNaN(milliseconds) || milliseconds < 0) return '--:--';
  const totalMinutes = Math.floor(milliseconds / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}, ${minutes} min`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  } else if (minutes >= 0) {
    // Show 0 min if applicable
    return `${minutes} min`;
  }
  return '0 min';
};

function timeStringToMilliseconds(timeStr: string): number {
  const [hours, minutes, seconds] = timeStr.split(':').map(Number);
  return ((hours * 60 + minutes) * 60 + seconds) * 1000;
}

export function evaluateWorkDurationFromTimeString(
  timeStr: string,
  targetHours: number = 8 // Chnage to 8 hours
): false | true | string {
  const actualMs = timeStringToMilliseconds(timeStr);
  const targetMs = targetHours * 60 * 60 * 1000;

  if (actualMs < targetMs) return false;
  if (actualMs === targetMs) return true;

  const overtimeMs = actualMs - targetMs;
  const { hours = 0, minutes = 0 } = intervalToDuration({
    start: 0,
    end: overtimeMs,
  });

  const parts = [];
  if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);

  return parts.join(' ');
}

export const formatDurationFromMs = (
  milliseconds: number,
  includeSeconds = true
): string => {
  if (isNaN(milliseconds) || milliseconds < 0) milliseconds = 0;

  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (includeSeconds) {
    return `${String(hours).padStart(1, '0')}:${String(minutes).padStart(
      2,
      '0'
    )}:${String(seconds).padStart(2, '0')}`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export function getTimesheetForDate(
  timesheets: Timesheet[],
  dateInput?: string | Date
): Timesheet | undefined {
  const targetDate = dateInput ? new Date(dateInput) : new Date();

  // 1. Try to find a timesheet for the target date
  const match = timesheets.find((ts) =>
    isSameDay(parseISO(ts.date), targetDate)
  );
  if (match) return match;

  // 2. Otherwise return the most recent timesheet
  const sorted = [...timesheets].sort((a, b) =>
    compareDesc(parseISO(a.date), parseISO(b.date))
  );
  return sorted[0];
}

export function getTotalBreakDurationFormatted(breaks: BreakSession[]): string {
  const totalMinutes = breaks.reduce((sum, b) => {
    const minutes = parseInt(b.duration_minutes || '0', 10);
    return sum + (isNaN(minutes) ? 0 : minutes);
  }, 0);

  const duration = intervalToDuration({
    start: new Date(0),
    end: addMinutes(new Date(0), totalMinutes),
  });

  const hours = duration.hours ?? 0;
  const minutes = duration.minutes ?? 0;

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours} hour${hours === 1 ? '' : 's'}`);
  }

  if (minutes > 0 || hours === 0) {
    parts.push(`${minutes} minute${minutes === 1 ? '' : 's'}`);
  }

  return parts.join(' ');
}

const dayIndexMap: Record<
  | 'SUNDAY'
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY',
  number
> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

interface GetPeriodRangeOptions {
  returnDates?: boolean; // return raw Date objects instead of strings
}

export function getPeriodRange(
  dateStr: string,
  type: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY',
  startDay:
    | 'SUNDAY'
    | 'MONDAY'
    | 'TUESDAY'
    | 'WEDNESDAY'
    | 'THURSDAY'
    | 'FRIDAY'
    | 'SATURDAY',
  options?: GetPeriodRangeOptions
) {
  const date = parseISO(dateStr);
  const startIndex = dayIndexMap[startDay] as 0 | 1 | 2 | 3 | 4 | 5 | 6;

  const periodStart = startOfWeek(date, { weekStartsOn: startIndex });

  let periodEnd: Date;
  switch (type) {
    case 'WEEKLY':
      periodEnd = addWeeks(periodStart, 1);
      break;
    case 'BIWEEKLY':
      periodEnd = addWeeks(periodStart, 2);
      break;
    case 'MONTHLY':
      periodEnd = addMonths(periodStart, 1);
      break;
    default:
      throw new Error(`Unsupported period type: ${type}`);
  }

  if (options?.returnDates) {
    return {
      periodStart,
      periodEnd,
    };
  }

  return {
    periodStart: format(periodStart, 'yyyy-MM-dd'),
    periodEnd: format(addDays(periodEnd, -1), 'yyyy-MM-dd'), // inclusive end
  };
}
