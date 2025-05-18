import * as React from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

import passwordIcon from '@/assets/input/password.svg'

interface InputProps extends React.ComponentProps<'input'> {
  label?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'sm' | 'lg';
  state?: 'default' | 'error' | 'success';
}

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,

      label,
      helperText,
      variant = 'lg',
      state = 'default',
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label className="text-sm font-medium text-gray-900">{label}</label>
        )}
        <div
          className={cn(
            'flex items-center rounded-lg border active:ring-4 disabled:bg-gray-50 disabled:border-gray-100',
            variant === 'lg' ? 'px-4 py-3' : 'px-3 py-2',
            state === 'error' &&
              'border-red-500 ring-4 ring-red-200 hover:border-red-500 focus:border-red-500 active:border-red-500',
            state === 'success' &&
              'border-green-500 ring-4 ring-green-200 hover:border-green-500 focus:border-green-500 active:border-green-500',
            state === 'default' &&
              'active:ring-blue-100 border-gray-300 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 active:border-blue-500',
            className
          )}
        >
          <Image src={passwordIcon} alt="" className='mr-1' />
          <div className="relative w-full">
            <input
              type={showPassword ? 'text' : 'password'}
              ref={ref}
              className={cn(
                'w-full bg-transparent outline-none text-base text-gray-900 placeholder:text-gray-500',
                props.disabled && 'cursor-not-justify opacity-50'
              )}
              {...props}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-1 flex items-center text-gray-400 hover:text-gray-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <Eye className="h-5 w-5" />
              ) : (
                <EyeOff className="h-5 w-5" />
              )}
            </button>
          </div>
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

PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
