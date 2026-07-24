import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  ChevronDown,
  Heart,
  Menu,
  Package,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import logo from '../../assets/images/plainb-logo.svg';
import { useAuthStore } from '../../features/auth/store/auth.store.ts';
import { useCartStore } from '../../features/cart/store/cart.store.ts';
import { useWishlistStore } from '../../features/wishlist/store/wishlist.store.ts';
import { cn } from '../../lib/utils/cn.ts';
import { PageContainer } from '../common/PageContainer.tsx';
import { ThemeSwitcher } from '../common/ThemeSwitcher.tsx';
import { Button } from '../ui/button.tsx';

const links = [
  ['Home', '/'],
  ['Shop', '/search'],
  ['How to buy', '/how-to-buy'],
  ['Support', '/support'],
] as const;

function SearchForm() {
  const searchId = useId();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') ?? '');
  return (
    <form
      role="search"
      className="relative flex-1"
      onSubmit={(event) => {
        event.preventDefault();
        const value = query.trim();
        navigate(value ? `/search?q=${encodeURIComponent(value)}` : '/search');
      }}
    >
      <label htmlFor={searchId} className="sr-only">Search products</label>
      <input
        id={searchId}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search products…"
        className="h-12 w-full rounded-xl border bg-navy-50 px-4 pr-12 text-sm dark:bg-navy-800"
      />
      <button aria-label="Submit search" className="absolute right-1 top-1 grid size-10 place-items-center rounded-lg bg-brand-500 text-navy-950">
        <Search className="size-5" />
      </button>
    </form>
  );
}

export function Header() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const cartCount = useCartStore((state) => state.count);
  const loadCartCount = useCartStore((state) => state.loadCount);
  const wishCount = useWishlistStore((state) => state.count);
  const loadWishCount = useWishlistStore((state) => state.loadCount);

  useEffect(() => {
    if (user) void Promise.all([loadCartCount(), loadWishCount()]);
  }, [loadCartCount, loadWishCount, user]);

  return (
    <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur dark:bg-navy-950/95">
      <div className="bg-navy-950 py-2 text-center text-xs font-semibold text-white">
        <PageContainer>PlainB marketplace • Business contact details pending approval</PageContainer>
      </div>
      <PageContainer className="flex h-20 items-center gap-4">
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <Button className="lg:hidden" variant="ghost" size="icon" aria-label="Open navigation">
              <Menu className="size-6" />
            </Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-navy-950/60" />
            <Dialog.Content className="fixed inset-y-0 left-0 z-50 w-[min(88vw,360px)] bg-white p-6 shadow-2xl dark:bg-navy-950">
              <div className="flex items-center justify-between">
                <Dialog.Title className="font-extrabold">Browse PlainB</Dialog.Title>
                <Dialog.Close asChild><Button variant="ghost" size="icon" aria-label="Close navigation"><X /></Button></Dialog.Close>
              </div>
              <nav className="mt-8 grid gap-2">{links.map(([label, to]) => <Dialog.Close asChild key={to}><NavLink className="rounded-xl px-4 py-3 font-bold hover:bg-brand-50 dark:hover:bg-navy-800" to={to}>{label}</NavLink></Dialog.Close>)}</nav>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <Link to="/" aria-label="PlainB home" className="shrink-0">
          <img src={logo} alt="PlainB" className="h-9 w-auto dark:brightness-0 dark:invert" />
        </Link>
        <nav className="hidden items-center gap-5 lg:flex">
          {links.map(([label, to]) => (
            <NavLink key={to} to={to} className={({ isActive }) => cn('text-sm font-bold hover:text-brand-600', isActive && 'text-brand-600')}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden max-w-xl flex-1 md:block"><SearchForm /></div>
        <div className="ml-auto flex items-center gap-1">
          <ThemeSwitcher />
          {user && (
            <>
              <Button asChild variant="ghost" size="icon">
                <Link to="/account/wishlist" aria-label={`Wishlist, ${wishCount} items`} className="relative">
                  <Heart className="size-5" />
                  {wishCount > 0 && <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-amber-400 text-[9px] font-black text-navy-950">{wishCount}</span>}
                </Link>
              </Button>
              <Button asChild variant="ghost" size="icon">
                <Link to="/cart" aria-label={`Cart, ${cartCount} items`} className="relative">
                  <ShoppingBag className="size-5" />
                  {cartCount > 0 && <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-brand-500 text-[9px] font-black text-navy-950">{cartCount}</span>}
                </Link>
              </Button>
            </>
          )}
          {user ? (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Button variant="outline" className="ml-1 rounded-full">
                  <span className="grid size-7 place-items-center rounded-full bg-brand-100 text-xs text-brand-800">{user.email.slice(0, 1).toUpperCase()}</span>
                  <span className="hidden max-w-28 truncate sm:inline">{user.email}</span>
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content sideOffset={10} align="end" className="z-50 min-w-56 rounded-xl border bg-white p-2 shadow-xl dark:bg-navy-900">
                  <DropdownMenu.Item asChild><Link className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm outline-none hover:bg-navy-50 dark:hover:bg-navy-800" to="/account/profile"><UserRound className="size-4" />Profile & addresses</Link></DropdownMenu.Item>
                  <DropdownMenu.Item asChild><Link className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm outline-none hover:bg-navy-50 dark:hover:bg-navy-800" to="/account/orders"><Package className="size-4" />Orders</Link></DropdownMenu.Item>
                  <DropdownMenu.Separator className="my-2 border-t" />
                  <DropdownMenu.Item className="cursor-pointer rounded-lg px-3 py-2 text-sm font-bold text-red-600 outline-none hover:bg-red-50" onSelect={() => void logout()}>Log out</DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          ) : <Button asChild className="ml-1"><Link to="/login">Sign in</Link></Button>}
        </div>
      </PageContainer>
      <PageContainer className="pb-3 md:hidden"><SearchForm /></PageContainer>
    </header>
  );
}
