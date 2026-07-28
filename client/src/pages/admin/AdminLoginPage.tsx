import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, LockKeyhole, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import logo from '../../assets/images/plainb-logo.svg';
import { Button } from '../../components/ui/button.tsx';
import { Card } from '../../components/ui/card.tsx';
import { Input } from '../../components/ui/input.tsx';
import { useAuthStore } from '../../features/auth/store/auth.store.ts';

const schema = z.object({ email: z.email(), password: z.string().min(1) });
type Fields = z.infer<typeof schema>;
export default function AdminLoginPage() {
  const current = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const status = useAuthStore((state) => state.status);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const form = useForm<Fields>({ resolver: zodResolver(schema) });
  if (current?.role === 'ADMIN') return <Navigate replace to="/admin" />;
  const from = (location.state as { from?: string } | null)?.from ?? '/admin';
  return (
    <main className="grid min-h-screen bg-navy-950 p-5 lg:grid-cols-2">
      <section className="hidden flex-col justify-between p-10 text-white lg:flex">
        <img src={logo} alt="PlainB" className="h-12 w-fit brightness-0 invert" />
        <div>
          <ShieldCheck className="size-10 text-brand-400" />
          <h1 className="mt-5 max-w-xl text-5xl font-black">
            Operate your marketplace with clarity.
          </h1>
          <p className="mt-5 text-navy-300">Secure access for authorized PlainB administrators.</p>
        </div>
        <p className="text-xs text-navy-400">Protected admin workspace</p>
      </section>
      <section className="grid place-items-center">
        <Card className="w-full max-w-md p-8">
          <p className="text-xs font-black uppercase tracking-widest text-brand-700">
            Administration
          </p>
          <h2 className="mt-2 text-3xl font-black">Admin sign in</h2>
          <p className="mt-2 text-sm text-navy-500">Use an account with the ADMIN role.</p>
          <form
            className="mt-7 space-y-4"
            onSubmit={form.handleSubmit(async (values) => {
              setError('');
              try {
                await login(values.email, values.password);
                const user = useAuthStore.getState().user;
                if (user?.role !== 'ADMIN') {
                  await logout();
                  setError('Admin access required.');
                  return;
                }
                navigate(from.startsWith('/admin') ? from : '/admin', { replace: true });
              } catch {
                setError(useAuthStore.getState().error || 'Unable to sign in.');
              }
            })}
          >
            <label className="block text-sm font-bold">
              Email
              <Input
                className="mt-2"
                type="email"
                autoComplete="email"
                {...form.register('email')}
              />
            </label>
            <label className="block text-sm font-bold">
              Password
              <div className="relative mt-2">
                <LockKeyhole className="absolute left-3 top-3 size-5 text-navy-400" />
                <Input
                  className="pl-10"
                  type="password"
                  autoComplete="current-password"
                  {...form.register('password')}
                />
              </div>
            </label>
            {error && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700"
              >
                {error}
              </p>
            )}
            <Button className="w-full" size="lg" disabled={status === 'loading'}>
              {status === 'loading' ? (
                'Signing in…'
              ) : (
                <>
                  Open dashboard <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </form>
        </Card>
      </section>
    </main>
  );
}
