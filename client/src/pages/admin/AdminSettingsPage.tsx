import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button.tsx';
import { Input } from '../../components/ui/input.tsx';
import { DemoBadge, PageTitle, Panel } from '../../features/admin/AdminUi.tsx';
import { useAdminStore } from '../../features/admin/admin.store.ts';

const tabs = ['General', 'Store', 'Notifications', 'Security'] as const;
export default function AdminSettingsPage() {
  const { settings, updateSettings } = useAdminStore();
  const [active, setActive] = useState<(typeof tabs)[number]>('General');
  return (
    <>
      <PageTitle
        title="Settings"
        description="Configure the admin workspace and store preferences."
        action={<DemoBadge />}
      />
      <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
        <Panel className="h-fit">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`block w-full rounded-lg px-3 py-2.5 text-left text-sm font-bold ${active === tab ? 'bg-navy-950 text-white' : 'hover:bg-navy-50'}`}
            >
              {tab}
            </button>
          ))}
        </Panel>
        <Panel>
          {active === 'General' && (
            <SettingsForm
              onSave={(data) =>
                updateSettings({
                  storeName: String(data.get('storeName')),
                  supportEmail: String(data.get('supportEmail')),
                })
              }
            >
              <Field label="Store name" name="storeName" defaultValue={settings.storeName} />
              <Field
                label="Support email"
                name="supportEmail"
                type="email"
                defaultValue={settings.supportEmail}
              />
            </SettingsForm>
          )}
          {active === 'Store' && (
            <SettingsForm
              onSave={(data) =>
                updateSettings({
                  currency: String(data.get('currency')),
                  lowStockThreshold: Number(data.get('lowStockThreshold')),
                })
              }
            >
              <Field label="Currency" name="currency" defaultValue={settings.currency} />
              <Field
                label="Low-stock threshold"
                name="lowStockThreshold"
                type="number"
                defaultValue={settings.lowStockThreshold}
              />
            </SettingsForm>
          )}
          {active === 'Notifications' && (
            <SettingsForm
              onSave={(data) =>
                updateSettings({
                  emailPayments: data.get('emailPayments') === 'on',
                  emailStock: data.get('emailStock') === 'on',
                })
              }
            >
              <Check
                label="Payment notifications"
                name="emailPayments"
                defaultChecked={settings.emailPayments}
              />
              <Check
                label="Low-stock notifications"
                name="emailStock"
                defaultChecked={settings.emailStock}
              />
            </SettingsForm>
          )}
          {active === 'Security' && (
            <div>
              <h3 className="font-black">Account security</h3>
              <p className="mt-2 text-sm text-navy-500">
                Password and profile security are managed through your account profile.
              </p>
              <Button asChild className="mt-5" variant="outline">
                <Link to="/account/profile#security">Open security settings</Link>
              </Button>
            </div>
          )}
        </Panel>
      </div>
      <p className="mt-5 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
        Dashboard settings are session-only demonstration values and reset on reload.
      </p>
    </>
  );
}
function SettingsForm({
  children,
  onSave,
}: {
  children: React.ReactNode;
  onSave: (data: FormData) => void;
}) {
  return (
    <form
      className="max-w-xl space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        onSave(new FormData(e.currentTarget));
        toast.success('Demo settings updated');
      }}
    >
      <h3 className="font-black">Preferences</h3>
      {children}
      <Button>Save changes</Button>
    </form>
  );
}
function Field({ label, ...props }: React.ComponentProps<typeof Input> & { label: string }) {
  return (
    <label className="block text-sm font-bold">
      {label}
      <Input className="mt-2" required {...props} />
    </label>
  );
}
function Check({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="flex items-center gap-3 rounded-lg border p-4 text-sm font-bold">
      <input type="checkbox" {...props} />
      {label}
    </label>
  );
}
