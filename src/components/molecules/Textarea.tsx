import * as React from 'react';

import { cn } from '@/lib/utils';

interface TextareaProps extends React.ComponentProps<'textarea'> {
  label?: string;
  helperText?: string;
  // leftIcon?: React.ReactNode;
  // rightIcon?: React.ReactNode;
  variant?: 'sm' | 'lg';
  state?: 'default' | 'error' | 'success';
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,

      label,
      helperText,
      // leftIcon,
      // rightIcon,
      variant = 'lg',
      state = 'default',
      ...props
    },
    ref
  ) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label className="text-sm font-medium text-gray-900">{label}</label>
        )}

        <div
          className={cn(
            'flex items-center rounded-lg border active:ring-4',
            variant === 'lg' ? 'px-4 py-3' : 'px-3 py-2',
            state === 'error' &&
              'border-red-500 ring-4 ring-red-200 hover:border-red-500 focus:border-red-500 active:border-red-500',
            state === 'success' &&
              'border-green-500 ring-4 ring-green-200 hover:border-green-500 focus:border-green-500 active:border-green-500',
            state === 'default' &&
              'active:ring-blue-100 border-gray-300 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 active:border-blue-500',
            props.disabled &&
              'bg-[#F0F2F5] text-custom-gray border-gray-300 active:ring-transparent active:border-gray-300 hover:border-gray-300 focus:border-gray-300 focus:ring-transparent cursor-not-justify',
            className
          )}
        >
          <textarea
            ref={ref}
            data-slot="textarea"
            className={cn(
              // 'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
              props.disabled && 'cursor-not-justify opacity-50',
              'w-full bg-transparent outline-none text-base text-gray-900 placeholder:text-gray-500',
              className
            )}
            {...props}
          />
        </div>

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
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
