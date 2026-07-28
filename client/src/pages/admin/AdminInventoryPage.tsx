import { useMemo, useState } from 'react';
import { Badge } from '../../components/ui/badge.tsx';
import { Input } from '../../components/ui/input.tsx';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table.tsx';
import { DemoBadge, PageTitle, Panel } from '../../features/admin/AdminUi.tsx';
import { statusTone } from '../../features/admin/admin-utils.ts';
import { useAdminStore } from '../../features/admin/admin.store.ts';

export default function AdminInventoryPage() {
  const { products, inventory, settings, updateInventory } = useAdminStore();
  const [filter, setFilter] = useState('all');
  const rows = useMemo(
    () =>
      inventory
        .map((item) => ({ ...item, product: products.find((p) => p._id === item.productId) }))
        .filter(
          (item) =>
            filter === 'all' ||
            (filter === 'low'
              ? item.quantity > 0 && item.quantity <= settings.lowStockThreshold
              : item.quantity === 0),
        ),
    [filter, inventory, products, settings.lowStockThreshold],
  );
  return (
    <>
      <PageTitle
        title="Inventory"
        description="Review stock availability and session-demo quantities."
        action={<DemoBadge />}
      />
      <Panel>
        <div className="mb-5 flex gap-2">
          {['all', 'low', 'out'].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`rounded-lg px-3 py-2 text-sm font-bold capitalize ${filter === item ? 'bg-navy-950 text-white' : 'bg-navy-100 text-navy-600'}`}
            >
              {item === 'out' ? 'Out of stock' : item}
            </button>
          ))}
        </div>
        <Table>
          <TableHeader>
            <tr>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead>Status</TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            {rows.map((item) => {
              const state =
                item.quantity === 0
                  ? 'out'
                  : item.quantity <= settings.lowStockThreshold
                    ? 'low'
                    : 'available';
              return (
                <TableRow key={item.productId}>
                  <TableCell className="font-bold">
                    {item.product?.title || 'Unknown product'}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    PB-{item.productId.slice(-8).toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <Input
                      className="w-24"
                      type="number"
                      min="0"
                      value={item.quantity}
                      onChange={(e) =>
                        updateInventory(
                          item.productId,
                          Math.max(0, Number(e.target.value)),
                          Number(e.target.value) > 0,
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <label className="flex items-center gap-2 font-semibold">
                      <input
                        type="checkbox"
                        checked={item.available}
                        onChange={(e) =>
                          updateInventory(item.productId, item.quantity, e.target.checked)
                        }
                      />
                      Available
                    </label>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusTone(state)}>
                      {state === 'out' ? 'Out of stock' : state}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
          Quantities and changes are demonstration data and reset when the page reloads.
        </p>
      </Panel>
    </>
  );
}
