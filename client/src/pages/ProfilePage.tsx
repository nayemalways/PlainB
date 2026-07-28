import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { PageContainer } from '../components/common/PageContainer.tsx';
import { ErrorState } from '../components/feedback/AsyncState.tsx';
import { Button } from '../components/ui/button.tsx';
import { Card } from '../components/ui/card.tsx';
import { useAuthStore } from '../features/auth/store/auth.store.ts';
import { useProfileStore } from '../features/profile/store/profile.store.ts';
import type { UserProfile } from '../features/profile/types/profile.types.ts';

const fields = [
  ['Name', 'name'],
  ['Phone', 'phone'],
  ['Address', 'address'],
  ['City', 'city'],
  ['State', 'state'],
  ['Postcode', 'postcode'],
  ['Country', 'country'],
] as const;

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const { profile, status, error, load, save, changePassword } = useProfileStore();
  const [photo, setPhoto] = useState<File>();
  const { register, handleSubmit, reset } = useForm<UserProfile>();
  const passwordForm = useForm<PasswordForm>();

  useEffect(() => {
    void load();
  }, [load]);
  useEffect(() => {
    if (profile) reset(profile);
  }, [profile, reset]);

  if (status === 'error' && !profile) {
    return (
      <PageContainer className="py-10">
        <ErrorState message={error ?? 'Unable to load profile.'} retry={() => void load()} />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-10">
      <p className="text-sm font-bold text-brand-700 dark:text-brand-400">ACCOUNT DETAILS</p>
      <h1 className="mt-1 text-3xl font-black">Profile and addresses</h1>

      <form
        className="mt-8 space-y-6"
        onSubmit={handleSubmit(async (data) => {
          await save(data, photo);
          setPhoto(undefined);
          toast.success('Profile saved');
        })}
      >
        <Card className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
          {profile?.profilePhoto ? (
            <img
              src={profile.profilePhoto}
              alt=""
              referrerPolicy="no-referrer"
              className="size-24 rounded-full object-cover"
            />
          ) : (
            <div className="grid size-24 place-items-center rounded-full bg-brand-100 text-3xl font-black text-brand-800">
              {(profile?.cus_address?.cus_name || profile?.email || 'U').slice(0, 1).toUpperCase()}
            </div>
          )}
          <div className="flex-1">
            <p className="font-bold">{profile?.cus_address?.cus_name || 'PlainB customer'}</p>
            <label className="mt-1 block text-sm text-navy-500">
              Email
              <input
                readOnly
                value={profile?.email ?? ''}
                className="mt-2 h-11 w-full max-w-md rounded-xl border bg-navy-50 px-3 text-navy-500 dark:bg-navy-800"
              />
            </label>
            <label className="mt-3 block text-sm font-bold">
              Replace profile photo
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                className="mt-2 block text-sm"
                onChange={(event) => setPhoto(event.target.files?.[0])}
              />
            </label>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {(['cus', 'ship'] as const).map((kind) => (
            <Card key={kind} className="p-6">
              <h2 className="text-xl font-black">
                {kind === 'cus' ? 'Billing address' : 'Shipping address'}
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {fields.map(([label, suffix]) => {
                  const key = `${kind}_address.${kind}_${suffix}` as
                    | 'cus_address.cus_name'
                    | 'ship_address.ship_name';
                  return (
                    <label key={suffix} className={suffix === 'address' ? 'sm:col-span-2' : ''}>
                      <span className="text-sm font-bold">{label}</span>
                      <input
                        className="mt-2 h-11 w-full rounded-xl border bg-white px-3 dark:bg-navy-800"
                        {...register(key, { required: suffix === 'name' })}
                      />
                    </label>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        <Button type="submit" size="lg" disabled={status === 'loading'}>
          {status === 'loading' ? 'Saving…' : 'Save profile'}
        </Button>
      </form>

      <Card id="security" className="mt-8 scroll-mt-32 p-6">
        <h2 className="text-xl font-black">Security</h2>
        {user?.canChangePassword ? (
          <form
            className="mt-5 grid max-w-xl gap-4"
            onSubmit={passwordForm.handleSubmit(async (data) => {
              if (data.newPassword !== data.confirmPassword) {
                passwordForm.setError('confirmPassword', { message: 'Passwords do not match.' });
                return;
              }
              await changePassword(data.currentPassword, data.newPassword);
              passwordForm.reset();
              toast.success('Password changed');
            })}
          >
            <label>
              <span className="text-sm font-bold">Current password</span>
              <input
                type="password"
                autoComplete="current-password"
                className="mt-2 h-11 w-full rounded-xl border bg-white px-3 dark:bg-navy-800"
                {...passwordForm.register('currentPassword', { required: true })}
              />
            </label>
            <label>
              <span className="text-sm font-bold">New password</span>
              <input
                type="password"
                autoComplete="new-password"
                className="mt-2 h-11 w-full rounded-xl border bg-white px-3 dark:bg-navy-800"
                {...passwordForm.register('newPassword', {
                  required: true,
                  minLength: { value: 8, message: 'Use at least 8 characters.' },
                })}
              />
              {passwordForm.formState.errors.newPassword && (
                <span className="mt-1 block text-xs text-red-600">
                  {passwordForm.formState.errors.newPassword.message}
                </span>
              )}
            </label>
            <label>
              <span className="text-sm font-bold">Confirm new password</span>
              <input
                type="password"
                autoComplete="new-password"
                className="mt-2 h-11 w-full rounded-xl border bg-white px-3 dark:bg-navy-800"
                {...passwordForm.register('confirmPassword', { required: true })}
              />
              {passwordForm.formState.errors.confirmPassword && (
                <span className="mt-1 block text-xs text-red-600">
                  {passwordForm.formState.errors.confirmPassword.message}
                </span>
              )}
            </label>
            <Button type="submit" className="w-fit" disabled={status === 'loading'}>
              Change password
            </Button>
          </form>
        ) : (
          <p className="mt-3 text-sm text-navy-500">
            This account signs in through Google. Password management is unavailable.
          </p>
        )}
      </Card>
    </PageContainer>
  );
}
