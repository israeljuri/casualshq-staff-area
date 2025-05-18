import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/select';

interface SelectProps {
  label?: string;
  helperText?: string;
  variant?: 'sm' | 'lg';
  state?: 'default' | 'error' | 'success';
  options: { label: string; value: string }[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
  label,
  helperText,
  variant = 'lg',
  state = 'default',
  options,
  value,
  onChange,
  placeholder = 'Select...',
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-sm font-medium text-gray-900">{label}</label>
      )}
      <ShadcnSelect value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          className={cn(
            'flex items-center justify-between rounded-lg border w-full text-base text-gray-900',
            variant === 'lg' ? 'px-4 py-6' : 'px-3 py-5 text-sm',
            state === 'error' &&
              'border-red-500 ring-4 ring-red-200 hover:border-red-500 focus:border-red-500 active:border-red-500',
            state === 'success' &&
              'border-green-500 ring-4 ring-green-200 hover:border-green-500 focus:border-green-500 active:border-green-500',
            state === 'default' &&
              'active:ring-blue-100 border-gray-300 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 active:border-blue-500',
            disabled &&
              'bg-[#F0F2F5] text-custom-gray border-gray-300 active:ring-transparent active:border-gray-300 hover:border-gray-300 focus:border-gray-300 focus:ring-transparent cursor-not-allowed'
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </ShadcnSelect>
      {helperText && (
        <p
          className={cn(
            'text-xs',
            state === 'error'
              ? 'text-red-600'
              : state === 'success'
              ? 'text-green-600'
              : 'text-gray-500'
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

export { Select };
