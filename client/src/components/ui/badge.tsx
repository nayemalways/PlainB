import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils/cn.ts';
export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold',
        className,
      )}
      {...props}
    />
  );
}
