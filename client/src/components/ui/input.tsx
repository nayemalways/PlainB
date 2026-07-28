import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils/cn.ts';
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'h-11 w-full rounded-lg border bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';
