import { useEffect, useState } from 'react';
import { intervalToDuration, parseISO } from 'date-fns';

const BreakValue = ({ breakStartedAt }: { breakStartedAt: string }) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  useEffect(() => {
    if (!breakStartedAt) return;

    const breakStartedDate = parseISO(breakStartedAt);

    const interval = setInterval(() => {
      const now = new Date();
      const duration = intervalToDuration({
        start: breakStartedDate,
        end: now,
      });

      const hours = String(duration.hours ?? 0).padStart(2, '0');
      const minutes = String(duration.minutes ?? 0).padStart(2, '0');
      const seconds = String(duration.seconds ?? 0).padStart(2, '0');

      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [breakStartedAt]);

  return <>{currentTime}</>;
};

export default BreakValue;
