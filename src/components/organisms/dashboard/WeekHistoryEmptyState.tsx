import {
  Table,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/molecules/Table';
import emptyIcon from '@/assets/empty-table.svg';
import Image from 'next/image';

export const WeekHistoryEmptyState = () => {
  return (
    <Table className="relative min-h-[40rem]">
      <TableHeader className="border border-olive-100 bg-olive">
        <TableRow className="grid grid-cols-5 bg-gray-50 hover:bg-gray-100 w-max">
          <TableHead>Date</TableHead>
          <TableHead>Clock-in</TableHead>
          <TableHead>Clock-out</TableHead>
          <TableHead>Break taken</TableHead>
          <TableHead>Hours worked</TableHead>
        </TableRow>
      </TableHeader>
      {/* // @ts-expect-error: Table doesn't accept div as child */}
      <TableCaption className="absolute w-max top-[40%] left-[50%] translate-x-[-50%] flex flex-col items-center text-center justify-center col-span-full">
        <Image src={emptyIcon} alt=""  className="w-[5rem] h-[5rem]" />

        <h3 className="text-base font-medium text-gray-700 mb-3 mt-6">
          No history records yet.
        </h3>
        <p className="text-gray-500 text-[0.875rem]">
          Clock in to record your hours for today.
        </p>
      </TableCaption>
    </Table>
  );
};
