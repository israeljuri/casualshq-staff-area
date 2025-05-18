import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/molecules/Table';

import { WeekHistoryEmptyState } from './WeekHistoryEmptyState';
import { BreakRecord, TimeLog } from '@/types';
import { formatDate } from 'date-fns';
import { formatHoursMinutesFromMs, formatTime } from '@/lib/utils';
import { Skeleton } from '@/components/atoms/skeleton';

interface WeekHistoryProps {
  isLoading: boolean;
  history: {
    totalWorkMs: number;
    totalBreakMs: number;
    id: string;
    date: string;
    clockInTime: string;
    clockOutTime?: string | null;
    breaks: BreakRecord[];
  }[];
}

export const WeekHistory = ({ history, isLoading }: WeekHistoryProps) => {
  const formattedWeekHistory: Array<
    TimeLog & { displayHoursWorked: string; displayBreakTaken: string }
  > = history.map((log) => ({
    ...log,
    clockInTime: log.clockInTime ? formatTime(log.clockInTime) : '---',
    clockOutTime: log.clockOutTime ? formatTime(log.clockOutTime) : '---',
    displayHoursWorked: formatHoursMinutesFromMs(log.totalWorkMs || 0),
    displayBreakTaken: formatHoursMinutesFromMs(log.totalBreakMs || 0),
  }));

  if (isLoading) {
    return <Skeleton className="h-[30rem] w-full rounded-xl"></Skeleton>;
  }

  if (!history || history.length === 0) {
    return <WeekHistoryEmptyState />;
  }

  return (
    <Table>
      <TableHeader className="bg-olive">
        <TableRow className="bg-gray-50 hover:bg-gray-50">
          <TableHead>Date</TableHead>
          <TableHead>Clock-in</TableHead>
          <TableHead>Clock-out</TableHead>
          <TableHead>Break taken</TableHead>
          <TableHead>Hours worked</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {formattedWeekHistory.map((log) => (
          <TableRow key={log.id} className="hover:bg-gray-50">
            <TableCell>{formatDate(log.date, 'MM/dd/yyyy')}</TableCell>
            <TableCell>{log.clockInTime}</TableCell>
            <TableCell>{log.clockOutTime}</TableCell>
            <TableCell>{log.displayBreakTaken}</TableCell>
            <TableCell>{log.displayHoursWorked}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
