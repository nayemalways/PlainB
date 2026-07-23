import { AlertCircle, PackageOpen, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button.tsx';

export function LoadingGrid({ count = 8 }: { count?: number }) {
  return (
    <div aria-label="Loading products" aria-live="polite" className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="h-80 animate-pulse rounded-card bg-navy-100 dark:bg-navy-800" />
      ))}
    </div>
  );
}

export function EmptyState({ title = 'Nothing here yet', message = 'Try another selection.' }) {
  return (
    <div className="grid min-h-64 place-items-center rounded-card border border-dashed p-8 text-center">
      <div>
        <PackageOpen className="mx-auto mb-3 size-10 text-brand-500" />
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="mt-1 text-sm text-navy-500 dark:text-navy-300">{message}</p>
      </div>
    </div>
  );
}

export function ErrorState({ message, retry }: { message: string; retry?: () => void }) {
  return (
    <div role="alert" className="grid min-h-64 place-items-center rounded-card border border-red-300 bg-red-50 p-8 text-center text-red-900 dark:bg-red-950/30 dark:text-red-100">
      <div>
        <AlertCircle className="mx-auto mb-3 size-10" />
        <h2 className="font-bold">We could not load this content</h2>
        <p className="mt-1 text-sm">{message}</p>
        {retry && <Button className="mt-4" variant="outline" onClick={retry}><RefreshCw className="size-4" />Retry</Button>}
      </div>
    </div>
  );
}
