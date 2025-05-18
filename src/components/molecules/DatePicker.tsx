// components/ui/date-picker-stepped.tsx

import * as React from 'react';
import { format, subDays, isValid } from 'date-fns';
import {
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

import { cn } from '@/lib/utils'; // Assumes you have this from Shadcn/ui setup
import { Button } from '@/components/molecules/Button';
import { Calendar } from '@/components/atoms/calendar'; // CalendarProps for type safety
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/atoms/popover';
import { Input } from '@/components/molecules/Input';

// Define DateRange type from react-day-picker, which Calendar uses
import { DateRange } from 'react-day-picker';

interface DatePreset {
  label: string;
  getValue: () => Date | DateRange;
}

export interface DatePickerProps {
  variant?: 'single' | 'range';
  initialDate?: Date;
  initialDateRange?: DateRange;
  onDateChange?: (date: Date | undefined) => void;
  onDateRangeChange?: (range: DateRange | undefined) => void;
  disabled?: boolean;
  className?: string; // For PopoverContent
  buttonClassName?: string;
  placeholder?: string;
  rangePlaceholderStart?: string;
  rangePlaceholderEnd?: string;
  // For single date picker, determines if 'Done' button is shown or selection is immediate
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
  rangePlaceholderStart = 'Start date',
  rangePlaceholderEnd = 'End date',
  showSingleDoneButton = true, // Default to showing Done button for single as per new request
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Internal state for selected dates
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    initialDate
  );
  const [selectedRange, setSelectedRange] = React.useState<
    DateRange | undefined
  >(initialDateRange);

  // State for current month view in calendar
  const [month, setMonth] = React.useState<Date | undefined>(
    variant === 'range'
      ? initialDateRange?.from || new Date()
      : initialDate || new Date()
  );

  // State for range picker view ("presets" or "custom")
  const [rangePickerView, setRangePickerView] = React.useState<
    'presets' | 'custom'
  >('presets');

  // Input states for custom range
  const [startInput, setStartInput] = React.useState<string>('');
  const [endInput, setEndInput] = React.useState<string>('');

  // Update internal states if initial props change
  React.useEffect(() => {
    setSelectedDate(initialDate);
    if (initialDate) setMonth(initialDate);
  }, [initialDate]);

  React.useEffect(() => {
    setSelectedRange(initialDateRange);
    if (initialDateRange?.from) {
      setMonth(initialDateRange.from);
      setStartInput(format(initialDateRange.from, 'dd/MM/yyyy'));
    } else {
      setStartInput('');
    }
    if (initialDateRange?.to) {
      setEndInput(format(initialDateRange.to, 'dd/MM/yyyy'));
    } else {
      setEndInput('');
    }
  }, [initialDateRange]);

  // Reset range view when popover opens for range picker
  React.useEffect(() => {
    if (isOpen && variant === 'range') {
      setRangePickerView('presets');
      // Also update input fields if a range is already selected
      if (selectedRange?.from)
        setStartInput(format(selectedRange.from, 'dd/MM/yyyy'));
      else setStartInput('');
      if (selectedRange?.to)
        setEndInput(format(selectedRange.to, 'dd/MM/yyyy'));
      else setEndInput('');
    }
  }, [isOpen, variant, selectedRange]);

  const handleSingleSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) setMonth(date);
    if (!showSingleDoneButton) {
      // Immediate selection if no Done button
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
      setStartInput(format(range.from, 'dd/MM/yyyy'));
      setMonth(range.from);
    } else {
      setStartInput('');
    }
    if (range?.to) {
      setEndInput(format(range.to, 'dd/MM/yyyy'));
    } else {
      setEndInput('');
    }
  };

  const parseDateInput = (dateString: string): Date | undefined => {
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const monthVal = parseInt(parts[1], 10) - 1; // Month is 0-indexed in Date
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
      setSelectedRange({ from: selectedRange?.from, to: newEndDate });
      if (!selectedRange?.from) setMonth(newEndDate);
    } else if (value === '') {
      setSelectedRange({ from: selectedRange?.from, to: undefined });
    }
  };

  const presets: DatePreset[] = [
    { label: 'Today', getValue: () => ({ from: new Date(), to: new Date() }) },
    {
      label: 'Yesterday',
      getValue: () => ({
        from: subDays(new Date(), 1),
        to: subDays(new Date(), 1),
      }),
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
    const value = preset.getValue() as DateRange; // Presets for range return DateRange
    setSelectedRange(value);
    if (value.from) setStartInput(format(value.from, 'dd/MM/yyyy'));
    if (value.to) setEndInput(format(value.to, 'dd/MM/yyyy'));
    if (onDateRangeChange) onDateRangeChange(value);
    setIsOpen(false);
  };

  const handleCustomRangeDone = () => {
    // Basic validation: ensure 'from' is before or same as 'to'
    if (
      selectedRange?.from &&
      selectedRange?.to &&
      selectedRange.from > selectedRange.to
    ) {
      // Optionally show an error message or swap dates
      alert('Start date must be before or same as end date.');
      return;
    }
    if (onDateRangeChange) onDateRangeChange(selectedRange);
    setIsOpen(false);
  };

  const displayValue = () => {
    if (variant === 'single') {
      return selectedDate ? format(selectedDate, 'dd/MM/yyyy') : placeholder;
    }
    // For range
    if (selectedRange?.from && selectedRange?.to) {
      return `${format(selectedRange.from, 'dd/MM/yyyy')} - ${format(
        selectedRange.to,
        'dd/MM/yyyy'
      )}`;
    }
    if (selectedRange?.from) {
      return `${format(selectedRange.from, 'dd/MM/yyyy')} - ...`;
    }
    return placeholder;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          disabled={disabled}
          className={cn(
            'justify-start text-left font-normal',
            !(variant === 'single' ? selectedDate : selectedRange?.from) &&
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
              <div className="p-3 space-y-1 min-w-[220px]">
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
              <div className="p-3 grid">
                <div className="flex items-center mb-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setRangePickerView('presets')}
                    className="mr-auto px-2"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Select Date Range
                  </Button>
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <Input
                    type="text"
                    placeholder={rangePlaceholderStart}
                    value={startInput}
                    onChange={handleStartInputChange}
                    // className="w-full text-sm"
                  />
                  {/* <span className="text-muted-foreground">-</span> */}
                  <Input
                    type="text"
                    placeholder={rangePlaceholderEnd}
                    value={endInput}
                    onChange={handleEndInputChange}
                    // className="w-full text-sm"
                  />
                </div>
                <Calendar
                  mode="range"
                  selected={selectedRange}
                  onSelect={handleRangeCalendarSelect} // Correct typing for onSelect
                  month={month}
                  onMonthChange={setMonth}
                  numberOfMonths={2}
                  disabled={disabled}
                  className="[&_button]:rounded-full [&_button:hover]:bg-accent [&_button:focus-visible]:ring-1 grid w-full" // Example of targeting inner buttons
                />
                <div className="grid w-full">
                  <Button className="w-full" onClick={handleCustomRangeDone}>
                    Done
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
