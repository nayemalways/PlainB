import * as Dialog from '@radix-ui/react-dialog';
import { Plus, Search, Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Badge } from '../../components/ui/badge.tsx';
import { Button } from '../../components/ui/button.tsx';
import { Input } from '../../components/ui/input.tsx';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table.tsx';
import { PageTitle, Panel } from '../../features/admin/AdminUi.tsx';
import { useAdminStore } from '../../features/admin/admin.store.ts';
import type { ProductInput } from '../../features/admin/types.ts';
import { formatPrice } from '../../lib/utils/format.ts';

const fieldClass = 'h-11 w-full rounded-lg border bg-white px-3 text-sm';
export default function AdminProductsPage() {
  const { products, brands, categories, status, error, createProduct, removeDemoProduct } =
    useAdminStore();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const filtered = useMemo(
    () => products.filter((p) => p.title.toLowerCase().includes(query.toLowerCase())),
    [products, query],
  );
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const images = form
      .getAll('images')
      .filter((item): item is File => item instanceof File && item.size > 0);
    if (!images.length || images.length > 6) return toast.error('Select between 1 and 6 images.');
    const input: ProductInput = {
      title: String(form.get('title')),
      price: String(form.get('price')),
      discount: form.get('discount') === 'on',
      discountPrice: String(form.get('discountPrice') || '0'),
      des: String(form.get('des')),
      color: String(form.get('color')),
      size: String(form.get('size')),
      star: String(form.get('star')),
      stock: form.get('stock') === 'on',
      remark: String(form.get('remark')),
      categoryId: String(form.get('categoryId')),
      brandId: String(form.get('brandId')),
      images,
    };
    try {
      await createProduct(input);
      toast.success('Product created');
      setOpen(false);
    } catch {
      /* store provides error */
    }
  };
  return (
    <>
      <PageTitle
        title="Products"
        description="Manage the live catalog and create new products."
        action={
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <Button>
                <Plus className="size-4" />
                Add product
              </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-navy-950/60" />
              <Dialog.Content className="fixed inset-4 z-50 mx-auto max-h-[calc(100vh-2rem)] max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
                <div className="flex justify-between">
                  <div>
                    <Dialog.Title className="text-xl font-black">Add product</Dialog.Title>
                    <Dialog.Description className="text-sm text-navy-500">
                      Creates a live product through the admin API.
                    </Dialog.Description>
                  </div>
                  <Dialog.Close asChild>
                    <Button variant="ghost" size="icon">
                      <X />
                    </Button>
                  </Dialog.Close>
                </div>
                <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={(e) => void submit(e)}>
                  <label className="text-sm font-bold sm:col-span-2">
                    Title
                    <Input className="mt-2" name="title" required maxLength={200} />
                  </label>
                  <label className="text-sm font-bold">
                    Price
                    <Input
                      className="mt-2"
                      name="price"
                      type="number"
                      min=".01"
                      step=".01"
                      required
                    />
                  </label>
                  <label className="text-sm font-bold">
                    Discount price
                    <Input
                      className="mt-2"
                      name="discountPrice"
                      type="number"
                      min="0"
                      step=".01"
                      defaultValue="0"
                    />
                  </label>
                  <label className="text-sm font-bold">
                    Brand
                    <select className={`${fieldClass} mt-2`} name="brandId" required>
                      <option value="">Select brand</option>
                      {brands.map((b) => (
                        <option key={b._id} value={b._id}>
                          {b.brandName}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="text-sm font-bold">
                    Category
                    <select className={`${fieldClass} mt-2`} name="categoryId" required>
                      <option value="">Select category</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.categoryName}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="text-sm font-bold">
                    Colors
                    <Input className="mt-2" name="color" placeholder="Black, White" required />
                  </label>
                  <label className="text-sm font-bold">
                    Sizes
                    <Input className="mt-2" name="size" placeholder="S, M, L" required />
                  </label>
                  <label className="text-sm font-bold">
                    Rating
                    <Input
                      className="mt-2"
                      name="star"
                      type="number"
                      min="0"
                      max="5"
                      step=".1"
                      defaultValue="0"
                      required
                    />
                  </label>
                  <label className="text-sm font-bold">
                    Remark
                    <Input className="mt-2" name="remark" placeholder="new" required />
                  </label>
                  <label className="text-sm font-bold sm:col-span-2">
                    Description
                    <textarea
                      className={`${fieldClass} mt-2 h-28 py-3`}
                      name="des"
                      required
                      maxLength={10000}
                    />
                  </label>
                  <label className="text-sm font-bold sm:col-span-2">
                    Images (1–6)
                    <Input
                      className="mt-2 py-2"
                      name="images"
                      type="file"
                      accept="image/*"
                      multiple
                      required
                    />
                  </label>
                  <label className="flex items-center gap-2 text-sm font-bold">
                    <input type="checkbox" name="discount" />
                    Discount active
                  </label>
                  <label className="flex items-center gap-2 text-sm font-bold">
                    <input type="checkbox" name="stock" defaultChecked />
                    In stock
                  </label>
                  {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}
                  <div className="flex justify-end gap-2 sm:col-span-2">
                    <Dialog.Close asChild>
                      <Button type="button" variant="ghost">
                        Cancel
                      </Button>
                    </Dialog.Close>
                    <Button disabled={status === 'loading'}>
                      {status === 'loading' ? 'Creating…' : 'Create product'}
                    </Button>
                  </div>
                </form>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        }
      />
      <Panel>
        <div className="relative mb-5 max-w-sm">
          <Search className="absolute left-3 top-3 size-4 text-navy-400" />
          <Input
            className="pl-9"
            placeholder="Search products…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Table>
          <TableHeader>
            <tr>
              <TableHead>Product</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            {filtered.map((product) => (
              <TableRow key={product._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={product.images[0]}
                      alt=""
                      className="size-10 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-bold">{product.title}</p>
                      <p className="text-xs text-navy-500">#{product._id.slice(-8)}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{product.brand?.brandName || '—'}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      product.stock ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }
                  >
                    {product.stock ? 'Available' : 'Out'}
                  </Badge>
                </TableCell>
                <TableCell className="font-bold">
                  {formatPrice(Number(product.discount ? product.discountPrice : product.price))}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Remove demo product"
                    onClick={() => {
                      removeDemoProduct(product._id);
                      toast('Demo removal only—reload to restore.');
                    }}
                  >
                    <Trash2 className="size-4 text-red-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!filtered.length && (
          <p className="py-12 text-center text-sm text-navy-500">No products found.</p>
        )}
        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
          Product removal is a session-only demo action until the delete API is available.
        </p>
      </Panel>
    </>
  );
}
