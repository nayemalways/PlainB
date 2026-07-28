import { Search } from 'lucide-react';
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
import { formatPrice } from '../../lib/utils/format.ts';
export default function AdminPaymentsPage() {
  const payments = useAdminStore((state) => state.payments);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const rows = useMemo(
    () =>
      payments.filter(
        (p) =>
          (status === 'all' || p.status === status) &&
          `${p.customer} ${p.transaction} ${p.email}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [payments, query, status],
  );
  return (
    <>
      <PageTitle
        title="Payments"
        description="Review transactions and payment outcomes."
        action={<DemoBadge />}
      />
      <Panel>
        <div className="mb-5 flex flex-wrap gap-3">
          <div className="relative min-w-64 flex-1">
            <Search className="absolute left-3 top-3 size-4 text-navy-400" />
            <Input
              className="pl-9"
              placeholder="Search payments…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select
            className="h-11 rounded-lg border bg-white px-3 text-sm font-bold"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">All statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        <Table>
          <TableHeader>
            <tr>
              <TableHead>Transaction</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            {rows.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-bold">{p.transaction}</TableCell>
                <TableCell>
                  <p className="font-semibold">{p.customer}</p>
                  <p className="text-xs text-navy-500">{p.email}</p>
                </TableCell>
                <TableCell>{new Date(p.date).toLocaleDateString('en-BD')}</TableCell>
                <TableCell>
                  <Badge className={statusTone(p.status)}>{p.status}</Badge>
                </TableCell>
                <TableCell className="text-right font-black">{formatPrice(p.amount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Panel>
    </>
  );
}
