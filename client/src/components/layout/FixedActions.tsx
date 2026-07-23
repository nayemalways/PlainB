import * as Tooltip from '@radix-ui/react-tooltip';
import { MessageCircle, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/auth.store.ts';
import { useCartStore } from '../../features/cart/store/cart.store.ts';

export function FixedActions() {
  const user = useAuthStore((state) => state.user);
  const count = useCartStore((state) => state.count);
  return (
    <Tooltip.Provider>
      <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-30 flex flex-col gap-3">
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button
              aria-label="Live chat placeholder"
              onClick={() => window.alert('Live chat is not configured yet.')}
              className="grid size-12 place-items-center rounded-full border bg-white shadow-xl hover:text-brand-600 dark:bg-navy-900"
            >
              <MessageCircle className="size-5" />
            </button>
          </Tooltip.Trigger>
          <Tooltip.Portal><Tooltip.Content side="left" className="rounded-lg bg-navy-950 px-3 py-2 text-xs text-white">Chat coming soon</Tooltip.Content></Tooltip.Portal>
        </Tooltip.Root>
        {user && (
          <Link aria-label={`Open cart with ${count} items`} to="/cart" className="relative grid size-14 place-items-center rounded-full bg-brand-500 text-navy-950 shadow-xl">
            <ShoppingBag className="size-6" />
            {count > 0 && <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-amber-400 text-[10px] font-black">{count}</span>}
          </Link>
        )}
      </div>
    </Tooltip.Provider>
  );
}
