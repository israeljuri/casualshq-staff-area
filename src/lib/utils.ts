import { format as formatFns, intervalToDuration, parseISO } from 'date-fns';

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
