import type {
  HTMLAttributes,
  TableHTMLAttributes,
  ThHTMLAttributes,
  TdHTMLAttributes,
} from 'react';
import { cn } from '../../lib/utils/cn.ts';
export const Table = ({ className, ...props }: TableHTMLAttributes<HTMLTableElement>) => (
  <div className="w-full overflow-x-auto">
    <table className={cn('w-full text-sm', className)} {...props} />
  </div>
);
export const TableHeader = (props: HTMLAttributes<HTMLTableSectionElement>) => (
  <thead
    className="border-b bg-navy-50 text-left text-xs uppercase tracking-wide text-navy-500"
    {...props}
  />
);
export const TableBody = (props: HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className="divide-y" {...props} />
);
export const TableRow = ({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={cn('transition-colors hover:bg-navy-50/70', className)} {...props} />
);
export const TableHead = ({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) => (
  <th className={cn('whitespace-nowrap px-5 py-3 font-bold', className)} {...props} />
);
export const TableCell = ({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={cn('px-5 py-4', className)} {...props} />
);
