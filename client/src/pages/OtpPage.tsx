import { zodResolver } from '@hookform/resolvers/zod';
import { ShieldCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '../components/ui/button.tsx';
import { Card } from '../components/ui/card.tsx';
import { useAuthStore } from '../features/auth/store/auth.store.ts';

const schema = z.object({ otp: z.string().regex(/^\d{6}$/, 'Enter the six-digit code.') });
type FormData = z.infer<typeof schema>;

export default function OtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const pendingEmail = useAuthStore((state) => state.pendingEmail);
  const verifyOtp = useAuthStore((state) => state.verifyOtp);
  const status = useAuthStore((state) => state.status);
  const authError = useAuthStore((state) => state.error);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });
  if (!pendingEmail) return <Navigate replace to="/login" />;
  const from = (location.state as { from?: string } | null)?.from ?? '/';
  return <Card className="w-full max-w-md p-7 text-center sm:p-9"><div className="mx-auto grid size-14 place-items-center rounded-2xl bg-brand-100 text-brand-800"><ShieldCheck /></div><h1 className="mt-5 text-3xl font-black">Check your email</h1><p className="mt-3 text-sm text-navy-500 dark:text-navy-300">Enter the six-digit code sent to <strong>{pendingEmail}</strong>.</p><form className="mt-7" onSubmit={handleSubmit(async ({ otp }) => { await verifyOtp(otp); navigate(from, { replace: true }); })}><label htmlFor="otp" className="sr-only">Verification code</label><input id="otp" inputMode="numeric" autoComplete="one-time-code" maxLength={6} className="h-14 w-full rounded-xl border bg-white text-center text-2xl font-black tracking-[0.5em] dark:bg-navy-800" {...register('otp')} />{errors.otp && <p role="alert" className="mt-2 text-xs text-red-600">{errors.otp.message}</p>}{authError && <p role="alert" className="mt-3 text-sm text-red-600">{authError}</p>}<Button type="submit" size="lg" className="mt-5 w-full" disabled={status === 'loading'}>{status === 'loading' ? 'Verifying…' : 'Verify and continue'}</Button></form></Card>;
}
