import * as Dialog from '@radix-ui/react-dialog';
import {
  ChevronDown,
  Heart,
  LogOut,
  Menu,
  Package,
  Search,
  Settings,
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
import { useProfileStore } from '../../features/profile/store/profile.store.ts';
import { cn } from '../../lib/utils/cn.ts';
import { PageContainer } from '../common/PageContainer.tsx';
import { Button } from '../ui/button.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu.tsx';

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
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const cartCount = useCartStore((state) => state.count);
  const loadCartCount = useCartStore((state) => state.loadCount);
  const wishCount = useWishlistStore((state) => state.count);
  const loadWishCount = useWishlistStore((state) => state.loadCount);
  const resetCart = useCartStore((state) => state.reset);
  const resetWishlist = useWishlistStore((state) => state.reset);
  const resetProfile = useProfileStore((state) => state.reset);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Local session state is still cleared when the server session is unavailable.
    } finally {
      resetCart();
      resetWishlist();
      resetProfile();
      navigate('/', { replace: true });
    }
  };

  useEffect(() => {
    if (user) void Promise.all([loadCartCount(), loadWishCount()]);
  }, [loadCartCount, loadWishCount, user]);

  return (
    <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
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
            <Dialog.Content className="fixed inset-y-0 left-0 z-50 w-[min(88vw,360px)] bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <Dialog.Title className="font-extrabold">Browse PlainB</Dialog.Title>
                <Dialog.Close asChild><Button variant="ghost" size="icon" aria-label="Close navigation"><X /></Button></Dialog.Close>
              </div>
              <nav className="mt-8 grid gap-2">{links.map(([label, to]) => <Dialog.Close asChild key={to}><NavLink className="rounded-xl px-4 py-3 font-bold hover:bg-brand-50" to={to}>{label}</NavLink></Dialog.Close>)}</nav>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <Link to="/" aria-label="PlainB home" className="shrink-0">
          <img src={logo} alt="PlainB" className="h-9 w-auto" />
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
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="group ml-1 rounded-full hover:border-brand-500 hover:bg-brand-50 focus-visible:ring-2 focus-visible:ring-brand-500"
                  aria-label={`Open account menu for ${user.name || user.email}`}
                >
                  {user.profilePhoto ? (
                    <img
                      src={user.profilePhoto}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="size-7 rounded-full object-cover"
                    />
                  ) : (
                    <span className="grid size-7 place-items-center rounded-full bg-brand-100 text-xs text-brand-800">
                      {(user.name || user.email).slice(0, 1).toUpperCase()}
                    </span>
                  )}
                  <span className="hidden max-w-28 truncate sm:inline">{user.name || user.email}</span>
                  <ChevronDown className="size-4 transition-transform group-data-[state=open]:rotate-180" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                sideOffset={10}
                align="end"
                collisionPadding={12}
                className="min-w-64"
              >
                  <DropdownMenuLabel className="border-b py-3">
                    <p className="truncate text-sm font-extrabold">{user.name || 'PlainB customer'}</p>
                    <p className="mt-0.5 truncate text-xs text-navy-500">{user.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuItem asChild><Link className="mt-1" to="/account/profile"><UserRound className="size-4" />Profile & addresses</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/account/profile#security"><Settings className="size-4" />Settings</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/account/orders"><Package className="size-4" />Orders</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/account/wishlist"><Heart className="size-4" />Wishlist</Link></DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="font-bold text-red-600 focus:bg-red-50"
                    onSelect={() => void handleLogout()}
                  >
                    <LogOut className="size-4" />Log out
                  </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : <Button asChild className="ml-1"><Link to="/login">Sign in</Link></Button>}
        </div>
      </PageContainer>
      <PageContainer className="pb-3 md:hidden"><SearchForm /></PageContainer>
    </header>
  );
}
