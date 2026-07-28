import { Plus } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '../../components/ui/button.tsx';
import { Input } from '../../components/ui/input.tsx';
import { PageTitle, Panel } from './AdminUi.tsx';
import { useAdminStore } from './admin.store.ts';

export function TaxonomyPage({ mode }: { mode: 'brand' | 'category' }) {
  const { brands, categories, createBrand, createCategory } = useAdminStore();
  const [busy, setBusy] = useState(false);
  const items =
    mode === 'brand'
      ? brands.map((item) => ({ id: item._id, name: item.brandName, image: item.brandImg }))
      : categories.map((item) => ({
          id: item._id,
          name: item.categoryName,
          image: item.categoryImg,
        }));
  const label = mode === 'brand' ? 'Brand' : 'Category';
  return (
    <>
      <PageTitle title={`${label}s`} description={`Manage the live product ${mode} list.`} />
      <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
        <Panel>
          <h3 className="font-black">Add {label.toLowerCase()}</h3>
          <p className="mt-1 text-xs text-navy-500">This form writes to the existing admin API.</p>
          <form
            className="mt-5 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              const form = event.currentTarget;
              const data = new FormData(form);
              const name = String(data.get('name'));
              const file = data.get('file');
              if (!(file instanceof File) || !file.size) return toast.error('Select an image.');
              setBusy(true);
              const request =
                mode === 'brand' ? createBrand(name, file) : createCategory(name, file);
              void request
                .then(() => {
                  form.reset();
                  toast.success(`${label} created`);
                })
                .catch(() => toast.error(`Unable to create ${label.toLowerCase()}.`))
                .finally(() => setBusy(false));
            }}
          >
            <label className="block text-sm font-bold">
              {label} name
              <Input className="mt-2" name="name" required maxLength={100} />
            </label>
            <label className="block text-sm font-bold">
              Image
              <Input className="mt-2 py-2" name="file" type="file" accept="image/*" required />
            </label>
            <Button className="w-full" disabled={busy}>
              <Plus className="size-4" />
              {busy ? 'Creating…' : `Add ${label.toLowerCase()}`}
            </Button>
          </form>
        </Panel>
        <Panel>
          <h3 className="font-black">Current {label.toLowerCase()}s</h3>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <div key={item.id} className="rounded-lg border p-4">
                <div className="grid h-16 place-items-center rounded-lg bg-navy-50">
                  {item.image ? (
                    <img src={item.image} alt="" className="max-h-12 max-w-full object-contain" />
                  ) : (
                    <span className="text-xl font-black text-brand-700">{item.name[0]}</span>
                  )}
                </div>
                <p className="mt-3 truncate text-sm font-bold">{item.name}</p>
              </div>
            ))}
          </div>
          {!items.length && (
            <p className="py-12 text-center text-sm text-navy-500">
              No {label.toLowerCase()}s available.
            </p>
          )}
        </Panel>
      </div>
    </>
  );
}
