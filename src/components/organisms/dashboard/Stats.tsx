import React from 'react';
import { StatCard } from '@/components/organisms/StatCard';
import { Skeleton } from '@/components/atoms/skeleton';

interface StatsProps {
  isLoading: boolean;
  clockedInAt: string;
  breakTaken: {
    value: string;
    expectDuration: string;
  };
  hoursWorked: {
    value: string;
    expectDuration: string;
  };
  hoursThisWeek: {
    value: string;
    expectDuration: string;
  };
}

const Stats = ({
  isLoading,
  clockedInAt,
  breakTaken,
  hoursWorked,
  hoursThisWeek,
}: StatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {isLoading ? (
        <Skeleton className="h-[8rem] w-full rounded-xl"></Skeleton>
      ) : (
        <StatCard title="Clocked in at" value={clockedInAt} />
      )}

      {isLoading ? (
        <Skeleton className="h-[8rem] w-full rounded-xl"></Skeleton>
      ) : (
        <StatCard
          title={
            <span>
              Break taken today{' '}
              <strong className="text-black">
                {breakTaken.expectDuration}
              </strong>
            </span>
          }
          value={breakTaken.value}
        />
      )}
      {isLoading ? (
        <Skeleton className="h-[8rem] w-full rounded-xl"></Skeleton>
      ) : (
        <StatCard
          title={
            <span>
              Hours worked{' '}
              <strong className="text-black">
                {hoursWorked.expectDuration}
              </strong>
            </span>
          }
          value={hoursWorked.value}
        />
      )}

      {isLoading ? (
        <Skeleton className="h-[8rem] w-full rounded-xl"></Skeleton>
      ) : (
        <StatCard
          title={
            <span>
              Hours this week{' '}
              <strong className="text-black">
                {hoursThisWeek.expectDuration}
              </strong>
            </span>
          }
          value={hoursThisWeek.value}
        />
      )}
    </div>
  );
};

export default Stats;
