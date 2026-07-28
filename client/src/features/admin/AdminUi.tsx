import type { PropsWithChildren, ReactNode } from 'react';
import { Badge } from '../../components/ui/badge.tsx';
import { Card } from '../../components/ui/card.tsx';

export const DemoBadge = () => (
  <Badge className="border-amber-200 bg-amber-50 text-amber-700">Demo data</Badge>
);
export function PageTitle({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-black">{title}</h2>
        <p className="mt-1 text-sm text-navy-500">{description}</p>
      </div>
      {action}
    </div>
  );
}
export function Panel({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return <Card className={`p-5 ${className}`}>{children}</Card>;
}
