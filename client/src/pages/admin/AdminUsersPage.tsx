import * as Dialog from '@radix-ui/react-dialog';
import { Eye, Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
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
import { statusTone } from '../../features/admin/admin-utils.ts';
import { useAdminStore } from '../../features/admin/admin.store.ts';
import type { IUsers } from '../../features/admin/types.ts';
import { formatPrice } from '../../lib/utils/format.ts';



export default function AdminUsersPage() {
  const { usersListQuery, usersList} = useAdminStore();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<IUsers | null>(null);
  const rows = useMemo(
    () => usersList.items.filter((u: IUsers) => `${u?.name} ${u?.email}`.toLowerCase().includes(query.toLowerCase())),
    [query, usersList.items],
  );


  console.log('rows: ', usersList.items)

  useEffect(() => {
    void usersListQuery();
  },[query, usersListQuery]);


  return (
    <>
      <PageTitle title="Users" description="Customer directory and account summaries." />
      <Panel>
        <div className="relative mb-5 max-w-sm">
          <Search className="absolute left-3 top-3 size-4 text-navy-400" />
          <Input
            className="pl-9"
            placeholder="Search users…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Table>
          <TableHeader>
            <tr>
              <TableHead>User</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Spent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </tr>
          </TableHeader>
          <TableBody>
            {rows.map((u: IUsers) => (
              <TableRow key={u._id}>
                <TableCell>
                  <p className="font-bold">{u.name || 'Unknown'}</p>
                  <p className="text-xs text-navy-500">{u.email}</p>
                </TableCell>
                <TableCell>{new Date(u.createdAt).toLocaleDateString('en-BD')}</TableCell>
                <TableCell>{u.orders}</TableCell>
                <TableCell className="font-bold">{formatPrice(u.spent)}</TableCell>
                <TableCell>
                  <Badge className={statusTone(u.isActive.toLowerCase())}>{u.isActive}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelected(u)}
                    aria-label={`View ${u.name}`}
                  >
                    <Eye className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Panel>
      <Dialog.Root open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-navy-950/60" />
          <Dialog.Content className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white p-7 shadow-2xl">
            <div className="flex justify-between">
              <Dialog.Title className="text-xl font-black">User details</Dialog.Title>
              <Dialog.Close asChild>
                <Button variant="ghost" size="icon">
                  <X />
                </Button>
              </Dialog.Close>
            </div>
            {selected && (
              <div className="mt-8">
                <div className="grid size-16 place-items-center rounded-full bg-brand-100 text-xl font-black text-brand-800">
                  {selected.name[0]}
                </div>
                <h3 className="mt-4 text-xl font-black">{selected.name}</h3>
                <p className="text-sm text-navy-500">{selected.email}</p>
                <dl className="mt-7 grid grid-cols-2 gap-4">
                  {[
                    ['Account status', selected.isActive],
                    ['Joined', new Date(selected.createdAt).toLocaleDateString('en-BD')],
                    ['Orders', selected.orders],
                    ['Lifetime spend', formatPrice(selected.spent)],
                  ].map(([label, value]) => (
                    <div className="rounded-lg bg-navy-50 p-4" key={String(label)}>
                      <dt className="text-xs font-bold text-navy-500">{label}</dt>
                      <dd className="mt-1 font-black capitalize">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
