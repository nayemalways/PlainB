import { Suspense, type ReactNode } from 'react';

export function LazyBoundary({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-[50vh] place-items-center" aria-live="polite">
          <div className="size-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
