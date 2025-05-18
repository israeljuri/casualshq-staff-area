import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-[8px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-[#F9FAFB] hover:bg-primary-200 active:bg-primary-300 border border-[#45524D] shadow-md',
        outline:
          'bg-white text-[#344054] hover:bg-white active:bg-[#F0F2F1] border border-[#E4E7EC] shadow-[0px_4px_4px_0px_rgba(11,3,45,0.03)] disabled:bg-[#D0D5DD]',
        ghost:
          'bg-transparent text-[#344054] hover:bg-[#F0F2F1] active:bg-[#E4E7EC]',
      },
      size: {
        sm: 'h-6 px-[10px] py-2 text-xs gap-1',
        md: 'h-8 px-3 py-5 text-sm gap-1.5',
        lg: 'h-10 px-4 py-6 text-base gap-2',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'lg',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading}
        {...props}
      >
        {leftIcon && <span className="inline-flex">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="inline-flex">{rightIcon}</span>}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
