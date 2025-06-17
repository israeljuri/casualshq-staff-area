import { useEffect, useState } from 'react';
import { intervalToDuration, parseISO } from 'date-fns';

const WorkValue = ({ clockedInAt }: { clockedInAt: string }) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  useEffect(() => {
    if (!clockedInAt) return;

    const clockedInDate = parseISO(clockedInAt);

    const interval = setInterval(() => {
      const now = new Date();
      const duration = intervalToDuration({
        start: clockedInDate,
        end: now,
      });

      const hours = String(duration.hours ?? 0).padStart(2, '0');
      const minutes = String(duration.minutes ?? 0).padStart(2, '0');
      const seconds = String(duration.seconds ?? 0).padStart(2, '0');

      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [clockedInAt]);

  return <>{currentTime}</>;
};

export default WorkValue;
