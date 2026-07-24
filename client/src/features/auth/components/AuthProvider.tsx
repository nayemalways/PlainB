import { useEffect, type PropsWithChildren } from 'react';
import { useAuthStore } from '../store/auth.store.ts';

export function AuthProvider({ children }: PropsWithChildren) {
  const initialize = useAuthStore((state) => state.initialize);
  const initialized = useAuthStore((state) => state.initialized);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  if (!initialized) {
    return (
      <div className="grid min-h-screen place-items-center bg-navy-950 text-white" aria-live="polite">
        <div className="text-center">
          <div className="mx-auto size-12 animate-spin rounded-full border-4 border-brand-500/30 border-t-brand-500" />
          <p className="mt-4 text-sm font-semibold">Restoring your PlainB session…</p>
        </div>
      </div>
    );
  }

  return children;
}
