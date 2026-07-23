import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { PageContainer } from '../components/common/PageContainer.tsx';
import { ErrorState } from '../components/feedback/AsyncState.tsx';
import { Button } from '../components/ui/button.tsx';
import { Card } from '../components/ui/card.tsx';
import { useProfileStore } from '../features/profile/store/profile.store.ts';
import type { UserProfile } from '../features/profile/types/profile.types.ts';

const fields = [
  ['Name', 'name'], ['Phone', 'phone'], ['Address', 'address'], ['City', 'city'],
  ['State', 'state'], ['Postcode', 'postcode'], ['Country', 'country'],
] as const;

export default function ProfilePage() {
  const { profile, status, error, load, save } = useProfileStore();
  const { register, handleSubmit, reset } = useForm<UserProfile>();
  useEffect(() => { void load(); }, [load]);
  useEffect(() => { if (profile) reset(profile); }, [profile, reset]);
  if (status === 'error' && !profile) return <PageContainer className="py-10"><ErrorState message={error ?? 'Unable to load profile.'} retry={() => void load()} /></PageContainer>;
  return <PageContainer className="py-10"><p className="text-sm font-bold text-brand-700 dark:text-brand-400">ACCOUNT DETAILS</p><h1 className="mt-1 text-3xl font-black">Profile and addresses</h1><form className="mt-8 space-y-6" onSubmit={handleSubmit(async (data) => { await save(data); toast.success('Profile saved'); })}><div className="grid gap-6 lg:grid-cols-2">{(['cus', 'ship'] as const).map((kind) => <Card key={kind} className="p-6"><h2 className="text-xl font-black">{kind === 'cus' ? 'Billing address' : 'Shipping address'}</h2><div className="mt-5 grid gap-4 sm:grid-cols-2">{fields.map(([label, suffix]) => { const key = `${kind}_address.${kind}_${suffix}` as 'cus_address.cus_name' | 'ship_address.ship_name'; return <label key={suffix} className={suffix === 'address' ? 'sm:col-span-2' : ''}><span className="text-sm font-bold">{label}</span><input className="mt-2 h-11 w-full rounded-xl border bg-white px-3 dark:bg-navy-800" {...register(key, { required: suffix !== 'state' })} /></label>; })}</div></Card>)}</div>{error && <p role="alert" className="text-sm text-red-600">{error}</p>}<Button type="submit" size="lg" disabled={status === 'loading'}>{status === 'loading' ? 'Saving…' : 'Save profile'}</Button></form></PageContainer>;
}
