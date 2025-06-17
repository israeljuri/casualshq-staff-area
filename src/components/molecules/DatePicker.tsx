// components/ui/date-picker-stepped.tsx

import * as React from 'react';
import { format, subDays, isValid } from 'date-fns';
import {
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/molecules/Button';
import { Calendar } from '@/components/atoms/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/atoms/popover';
import { Input } from '@/components/molecules/Input';
import { DateRange } from 'react-day-picker';

interface DatePreset {
  label: string;
  getValue: () => DateRange;
}

export interface DatePickerProps {
  variant?: 'single' | 'range';
  initialDate?: Date;
  initialDateRange?: DateRange;
  onDateChange?: (date: Date | undefined) => void;
  onDateRangeChange?: (range: DateRange | undefined) => void;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  placeholder?: string;
  rangePlaceholderStart?: string;
  rangePlaceholderEnd?: string;
  showSingleDoneButton?: boolean;
}

export function DatePicker({
  variant = 'single',
  initialDate,
  initialDateRange,
  onDateChange,
  onDateRangeChange,
  disabled,
  className,
  buttonClassName,
  placeholder = 'Pick a date',
  showSingleDoneButton = true,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // --- State Management Refactor ---
  // FIX #2: Differentiate between draft state and committed state for "reset on outside click"
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    initialDate
  );

  // This is the "final" or "committed" range that is only set on "Done"
  const [committedRange, setCommittedRange] = React.useState<
    DateRange | undefined
  >(initialDateRange);
  // This is the "draft" range that the user interacts with inside the popover
  const [selectedRange, setSelectedRange] = React.useState<
    DateRange | undefined
  >(initialDateRange);

  const [month, setMonth] = React.useState<Date | undefined>(
    variant === 'range'
      ? initialDateRange?.from || new Date()
      : initialDate || new Date()
  );
  const [rangePickerView, setRangePickerView] = React.useState<
    'presets' | 'custom'
  >('presets');
  const [startInput, setStartInput] = React.useState<string>('');
  const [endInput, setEndInput] = React.useState<string>('');

  // Effect to sync inputs with the selectedRange (draft state)
  React.useEffect(() => {
    if (selectedRange?.from) {
      setStartInput(format(selectedRange.from, 'dd/MM/yyyy'));
    } else {
      setStartInput('');
    }
    if (selectedRange?.to) {
      setEndInput(format(selectedRange.to, 'dd/MM/yyyy'));
    } else {
      setEndInput('');
    }
  }, [selectedRange]);

  // Update internal states if initial props change
  React.useEffect(() => {
    setSelectedDate(initialDate);
    if (initialDate) setMonth(initialDate);
  }, [initialDate]);

  React.useEffect(() => {
    setCommittedRange(initialDateRange);
    setSelectedRange(initialDateRange);
    if (initialDateRange?.from) setMonth(initialDateRange.from);
  }, [initialDateRange]);

  // FIX #2: Handle popover close logic
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // If closing, reset the draft range to the last committed range
      setSelectedRange(committedRange);
      setRangePickerView('presets'); // Reset view on close
    }
    setIsOpen(open);
  };

  const handleSingleSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) setMonth(date);
    if (!showSingleDoneButton) {
      if (onDateChange) onDateChange(date);
      if (date) setIsOpen(false);
    }
  };

  const handleSingleDone = () => {
    if (onDateChange) onDateChange(selectedDate);
    setIsOpen(false);
  };

  const handleRangeCalendarSelect = (range: DateRange | undefined) => {
    setSelectedRange(range);
    if (range?.from) {
      setMonth(range.from);
    }
  };

  const parseDateInput = (dateString: string): Date | undefined => {
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const monthVal = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      if (
        !isNaN(day) &&
        !isNaN(monthVal) &&
        !isNaN(year) &&
        String(year).length === 4
      ) {
        const date = new Date(year, monthVal, day);
        if (
          isValid(date) &&
          date.getFullYear() === year &&
          date.getMonth() === monthVal &&
          date.getDate() === day
        ) {
          return date;
        }
      }
    }
    return undefined;
  };

  const handleStartInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStartInput(value);
    const newStartDate = parseDateInput(value);
    if (newStartDate) {
      setSelectedRange((prev) => ({ ...prev, from: newStartDate }));
      setMonth(newStartDate);
    } else if (value === '') {
      setSelectedRange((prev) => ({ ...prev, from: undefined }));
    }
  };

  const handleEndInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEndInput(value);
    const newEndDate = parseDateInput(value);
    if (newEndDate) {
      setSelectedRange((prev: DateRange | undefined): DateRange | undefined => ({ from: prev?.from, to: newEndDate }));
      if (!selectedRange?.from) setMonth(newEndDate);
    } else if (value === '') {
      setSelectedRange((prev: DateRange | undefined): DateRange | undefined => ({ from: prev?.from, to: undefined }));
    }
  };

  const presets: DatePreset[] = [
    // FIX #3: "Today" preset now only sets the 'from' date.
    { label: 'Today', getValue: () => ({ from: new Date(), to: undefined }) },
    // FIX #4: "Yesterday" preset now sets 'from' to yesterday and 'to' to today.
    {
      label: 'Yesterday',
      getValue: () => ({ from: subDays(new Date(), 1), to: new Date() }),
    },
    {
      label: 'Last 7 days',
      getValue: () => ({ from: subDays(new Date(), 6), to: new Date() }),
    },
    {
      label: 'Last 14 days',
      getValue: () => ({ from: subDays(new Date(), 13), to: new Date() }),
    },
    {
      label: 'Last 30 days',
      getValue: () => ({ from: subDays(new Date(), 29), to: new Date() }),
    },
  ];

  const handleRangePresetSelect = (preset: DatePreset) => {
    const value = preset.getValue();
    setSelectedRange(value);
    setRangePickerView('custom'); // Move to custom view after selecting a preset
    if (value.from) {
      setMonth(value.from);
    }
    // FIX #2: Do not close the popover after selecting a preset.
  };

  const handleCustomRangeDone = () => {
    if (
      selectedRange?.from &&
      selectedRange?.to &&
      selectedRange.from > selectedRange.to
    ) {
      alert('Start date must be before or same as end date.');
      return;
    }
    // Commit the changes
    setCommittedRange(selectedRange);
    if (onDateRangeChange) onDateRangeChange(selectedRange);
    setIsOpen(false);
  };

  const displayValue = () => {
    if (variant === 'single') {
      return selectedDate ? format(selectedDate, 'dd/MM/yyyy') : placeholder;
    }
    // For range, display the *committed* range
    if (committedRange?.from && committedRange?.to) {
      return `${format(committedRange.from, 'dd/MM/yyyy')} - ${format(
        committedRange.to,
        'dd/MM/yyyy'
      )}`;
    }
    if (committedRange?.from) {
      return `${format(committedRange.from, 'dd/MM/yyyy')} - ...`;
    }
    return placeholder;
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          disabled={disabled}
          className={cn(
            'justify-start text-left font-normal',
            !(variant === 'single' ? selectedDate : committedRange?.from) &&
              'text-muted-foreground',
            buttonClassName
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayValue()}
          <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('w-auto p-0', className)} align="start">
        {variant === 'single' && (
          <div className="p-3">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleSingleSelect as (date: Date | undefined) => void} // Type assertion for Calendar's onSelect
              month={month}
              onMonthChange={setMonth}
              initialFocus
              disabled={disabled}
              className="w-full [&_button]:rounded-full [&_button:hover]:bg-accent [&_button:focus-visible]:ring-1"
            />
            {showSingleDoneButton && (
              <div className="grid w-full">
                <Button onClick={handleSingleDone}>Done</Button>
              </div>
            )}
          </div>
        )}

        {variant === 'range' && (
          <>
            {rangePickerView === 'presets' && (
              <div className="p-3 space-y-1 w-[250px]">
                {presets.map((preset) => (
                  <Button
                    key={preset.label}
                    variant="ghost"
                    className="w-full justify-start px-3 py-1.5 text-sm"
                    onClick={() => handleRangePresetSelect(preset)}
                  >
                    {preset.label}
                  </Button>
                ))}
                <div className="border-t my-1"></div> {/* Separator */}
                <Button
                  variant="ghost"
                  className="w-full justify-between px-3 py-1.5 text-sm"
                  onClick={() => setRangePickerView('custom')}
                >
                  Custom Range
                  <ChevronRight className="ml-auto h-4 w-4" />
                </Button>
              </div>
            )}

            {rangePickerView === 'custom' && (
              // Set a fixed width and use grid with a gap for consistent spacing
              <div className="p-3 grid gap-4 w-[250px]">
                <div className="flex items-center -ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setRangePickerView('presets')}
                    className="mr-auto px-2 font-semibold"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Select date range
                  </Button>
                </div>

                {/* Use a 2-column grid for the inputs for a clean, aligned layout */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1">
                    <label
                      htmlFor="start-date"
                      className="text-sm text-muted-foreground"
                    >
                      Start
                    </label>
                    <Input
                      id="start-date"
                      variant="sm"
                      placeholder="dd/mm/yyyy"
                      value={startInput}
                      onChange={handleStartInputChange}
                    />
                  </div>
                  <div className="grid gap-1">
                    <label
                      htmlFor="end-date"
                      className="text-sm text-muted-foreground"
                    >
                      End
                    </label>
                    <Input
                      id="end-date"
                      variant="sm"
                      placeholder="dd/mm/yyyy"
                      value={endInput}
                      onChange={handleEndInputChange}
                    />
                  </div>
                </div>

                <Calendar
                  mode="range"
                  selected={selectedRange}
                  onSelect={handleRangeCalendarSelect}
                  month={month}
                  onMonthChange={setMonth}
                  numberOfMonths={1} // This correctly keeps it as one calendar
                  disabled={disabled}
                  className="!m-0 p-0" // Reset margin/padding for cleaner integration
                />
                <div className="grid w-full">
                  <Button onClick={handleCustomRangeDone}>Done</Button>
                </div>
              </div>
            )}
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
