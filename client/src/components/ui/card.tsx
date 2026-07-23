import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils/cn.ts';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-card border border-navy-200/70 bg-white shadow-market dark:border-navy-700 dark:bg-navy-900',
        className,
      )}
      {...props}
    />
  );
}
