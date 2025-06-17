import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/molecules/Table';

import { WeekHistoryEmptyState } from './WeekHistoryEmptyState';
import { format, formatDate } from 'date-fns';
import { Skeleton } from '@/components/atoms/skeleton';
import { Timesheet } from '@/types/dashboard';
import { PaginationControls } from '../PaginationControls';

interface WeekHistoryProps {
  isLoading: boolean;
  timesheets: Timesheet[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  pageSize: number;
}

export const WeekHistory = ({ isLoading, timesheets,
 currentPage,
 totalPages,
 onPageChange,
 totalItems,
 pageSize }: WeekHistoryProps) => {
  if (isLoading) {
    return <Skeleton className="h-[30rem] w-full rounded-xl"></Skeleton>;
  }

  if (!timesheets || timesheets.length === 0) {
    return <WeekHistoryEmptyState />;
  }

  return (
    <>
      <h3 className="text-[1.5rem] font-medium text-gray-800 mb-4">
        Week History
      </h3>
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
          {timesheets.map((log) => (
            <TableRow key={log.id} className="hover:bg-gray-50">
              <TableCell>{log.date ? formatDate(log.date, 'MM/dd/yyyy') : ''}</TableCell>
              <TableCell>{log.time_in ? format(log.time_in, "h:mma") : ''}</TableCell>
              <TableCell>{log.time_out ? format(log.time_out, "h:mma") : ''}</TableCell>
              <TableCell>{Math.round(Number(log.total_break)) || 0} minutes</TableCell>
              <TableCell>{Math.round(Number(log.total_hours)) || 0} hours</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        totalItems={totalItems}
        pageSize={pageSize}
      />
    </>
  );
};
