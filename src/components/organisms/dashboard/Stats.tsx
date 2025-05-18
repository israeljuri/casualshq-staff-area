import { formatHoursMinutesFromMs, formatTime } from '@/lib/utils';
import React from 'react';
import { StatCard } from '@/components/organisms/StatCard';
import { ActiveSessionState, Staff } from '@/types';
import { Skeleton } from '@/components/atoms/skeleton';

const Stats = ({
  staffData,
  hoursWorkedThisWeek,
  activeSession,
  statsForSelectedDate,
  isTodaySelected,
  breakTimerMs,
  workTimerMs,
  isLoading,
}: {
  staffData: Staff | undefined;
  hoursWorkedThisWeek: number;
  activeSession: ActiveSessionState;
  statsForSelectedDate: {
    clockedInAt: string | null;
    totalWorkMs: number;
    totalBreakMs: number;
  };
  isTodaySelected: boolean;
  breakTimerMs: number;
  workTimerMs: number;
  isLoading: boolean;
}) => {
  const targetDailyHoursMs =
    (staffData?.targetDailyHours || 8) * 60 * 60 * 1000;
  const targetWeeklyHoursMs =
    (staffData?.targetWeeklyHours || 40) * 60 * 60 * 1000;
  const targetBreakPerDayMs =
    (staffData?.targetBreakPerDayMinutes || 60) * 60 * 1000;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Clocked in at"
        value={
          statsForSelectedDate.clockedInAt ||
          (isTodaySelected && activeSession.isActive
            ? formatTime(activeSession.todaysLog?.clockInTime || new Date())
            : '--:--')
        }
      />

      <StatCard
        title={
          <span>
            Break taken{' '}
            <strong className="text-black">
              ({formatHoursMinutesFromMs(targetBreakPerDayMs)})
            </strong>
          </span>
        }
        value={formatHoursMinutesFromMs(
          statsForSelectedDate.totalBreakMs +
            (activeSession.isOnBreak ? breakTimerMs : 0)
        )}
      />

      <StatCard
        title={
          <span>
            Hours worked{' '}
            <strong className="text-black">
              ({formatHoursMinutesFromMs(targetDailyHoursMs)})
            </strong>
          </span>
        }
        value={formatHoursMinutesFromMs(
          statsForSelectedDate.totalWorkMs +
            (!activeSession.isOnBreak && activeSession.isActive
              ? workTimerMs
              : 0)
        )}
      />

      {isLoading && (
        <Skeleton className="h-[8rem] w-full rounded-xl"></Skeleton>
      )}
      {!isLoading && (
        <StatCard
          title={
            <span>
              Hours this week{' '}
              <strong className="text-black">
                ({formatHoursMinutesFromMs(targetWeeklyHoursMs)})
              </strong>
            </span>
          }
          value={formatHoursMinutesFromMs(
            hoursWorkedThisWeek +
              (!activeSession.isOnBreak &&
              activeSession.isActive &&
              isTodaySelected
                ? workTimerMs
                : 0)
          )}
        />
      )}
    </div>
  );
};

export default Stats;
