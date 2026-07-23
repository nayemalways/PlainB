import { Outlet } from 'react-router-dom';
import logo from '../../assets/images/plainb-logo.svg';
import { ThemeSwitcher } from '../../components/common/ThemeSwitcher.tsx';

export function AuthLayout() {
  return (
    <main className="grid min-h-screen bg-navy-50 dark:bg-navy-950 lg:grid-cols-2">
      <section className="hidden bg-navy-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <img src={logo} alt="PlainB" className="h-12 w-fit brightness-0 invert" />
        <div><p className="text-sm font-bold text-brand-400">SECURE ACCOUNT ACCESS</p><h1 className="mt-3 max-w-lg text-5xl font-black leading-tight">Your cart, wishlist, and orders—ready when you are.</h1></div>
        <p className="text-sm text-navy-300">PlainB uses one-time email codes and secure server-managed sessions.</p>
      </section>
      <section className="relative grid place-items-center p-5">
        <div className="absolute right-5 top-5"><ThemeSwitcher /></div>
        <Outlet />
      </section>
    </main>
  );
}
