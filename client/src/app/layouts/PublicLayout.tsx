import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { FixedActions } from '../../components/layout/FixedActions.tsx';
import { Footer } from '../../components/layout/Footer.tsx';
import { Header } from '../../components/layout/Header.tsx';

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#f7f9fb] text-navy-900 dark:bg-navy-950 dark:text-navy-100">
      <Header />
      <main><Outlet /></main>
      <Footer />
      <FixedActions />
      <Toaster position="bottom-center" />
      <ScrollRestoration />
    </div>
  );
}
