import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '../components/ui/button.tsx';
import { Card } from '../components/ui/card.tsx';
import { useAuthStore } from '../features/auth/store/auth.store.ts';

const schema = z.object({ email: z.email('Enter a valid email address.') });
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const requestOtp = useAuthStore((state) => state.requestOtp);
  const status = useAuthStore((state) => state.status);
  const authError = useAuthStore((state) => state.error);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });
  const from = (location.state as { from?: string } | null)?.from ?? '/';

  return (
    <Card className="w-full max-w-md p-7 sm:p-9">
      <p className="text-sm font-extrabold tracking-widest text-brand-700 dark:text-brand-400">WELCOME BACK</p>
      <h1 className="mt-2 text-3xl font-black">Sign in to PlainB</h1>
      <p className="mt-3 text-sm leading-6 text-navy-500 dark:text-navy-300">We will email you a one-time verification code. No password required.</p>
      <form className="mt-7 space-y-5" onSubmit={handleSubmit(async ({ email }) => { await requestOtp(email); navigate('/otp-verify', { state: { from } }); })}>
        <div><label htmlFor="email" className="text-sm font-bold">Email address</label><div className="relative mt-2"><Mail className="absolute left-3 top-3.5 size-5 text-navy-400" /><input id="email" type="email" autoComplete="email" className="h-12 w-full rounded-xl border bg-white pl-11 pr-4 dark:bg-navy-800" {...register('email')} /></div>{errors.email && <p role="alert" className="mt-2 text-xs text-red-600">{errors.email.message}</p>}</div>
        {authError && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-200">{authError}</p>}
        <Button type="submit" size="lg" className="w-full" disabled={status === 'loading'}>{status === 'loading' ? 'Sending code…' : <>Continue <ArrowRight className="size-5" /></>}</Button>
      </form>
      <Link to="/" className="mt-5 block text-center text-sm font-bold text-brand-700 dark:text-brand-400">Return to store</Link>
    </Card>
  );
}
