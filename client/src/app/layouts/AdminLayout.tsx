import * as Dialog from '@radix-ui/react-dialog';
import { BarChart3, Boxes, CreditCard, FolderTree, LayoutDashboard, LogOut, Menu, PackagePlus, Settings, Tags, Users, X } from 'lucide-react';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/plainb-logo.svg';
import { Button } from '../../components/ui/button.tsx';
import { useAdminStore } from '../../features/admin/admin.store.ts';
import { useAuthStore } from '../../features/auth/store/auth.store.ts';
import { cn } from '../../lib/utils/cn.ts';

const navigation = [
  ['Overview', '/admin', LayoutDashboard], ['Products', '/admin/products', PackagePlus],
  ['Inventory', '/admin/inventory', Boxes], ['Payments', '/admin/payments', CreditCard],
  ['Users', '/admin/users', Users], ['Brands', '/admin/brands', Tags],
  ['Categories', '/admin/categories', FolderTree], ['Settings', '/admin/settings', Settings],
] as const;

function Sidebar({ close }: { close?: () => void }) {
  return <div className="flex h-full flex-col bg-navy-950 text-white">
    <div className="flex h-20 items-center border-b border-white/10 px-6"><img src={logo} alt="PlainB" className="h-9 brightness-0 invert" /></div>
    <nav className="flex-1 space-y-1 p-4">{navigation.map(([label, to, Icon]) => <NavLink end={to === '/admin'} onClick={close} key={to} to={to} className={({ isActive }) => cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold text-navy-300 hover:bg-white/10 hover:text-white', isActive && 'bg-brand-500 text-navy-950 hover:bg-brand-500 hover:text-navy-950')}><Icon className="size-4" />{label}</NavLink>)}</nav>
    <div className="border-t border-white/10 p-4 text-xs text-navy-400"><BarChart3 className="mb-2 size-5 text-brand-400" />PlainB administration</div>
  </div>;
}

export function AdminLayout() {
  const load = useAdminStore((state) => state.load);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => { void load(); }, [load]);
  const page = navigation.find(([, to]) => to === location.pathname)?.[0] ?? 'Dashboard';
  const signOut = async () => { await logout(); navigate('/admin/login', { replace: true }); };
  return <div className="min-h-screen bg-navy-50 text-navy-900">
    <aside className="fixed inset-y-0 left-0 hidden w-64 lg:block"><Sidebar /></aside>
    <div className="lg:pl-64">
      <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b bg-white/95 px-4 backdrop-blur sm:px-7">
        <Dialog.Root><Dialog.Trigger asChild><Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open admin navigation"><Menu /></Button></Dialog.Trigger><Dialog.Portal><Dialog.Overlay className="fixed inset-0 z-50 bg-navy-950/50" /><Dialog.Content className="fixed inset-y-0 left-0 z-50 w-72"><Dialog.Title className="sr-only">Admin navigation</Dialog.Title><Dialog.Close className="absolute right-3 top-3 z-10 text-white" aria-label="Close navigation"><X /></Dialog.Close><Sidebar /></Dialog.Content></Dialog.Portal></Dialog.Root>
        <div className="flex-1"><p className="text-xs font-bold uppercase tracking-widest text-brand-700">Admin dashboard</p><h1 className="text-xl font-black">{page}</h1></div>
        <div className="hidden text-right sm:block"><p className="text-sm font-bold">{user?.name || 'Administrator'}</p><p className="text-xs text-navy-500">{user?.email}</p></div>
        <Button variant="ghost" size="icon" aria-label="Log out" onClick={() => void signOut()}><LogOut className="size-5" /></Button>
      </header>
      <main className="p-4 sm:p-7"><Outlet /></main>
      <Toaster position="bottom-center" />
    </div>
  </div>;
}
