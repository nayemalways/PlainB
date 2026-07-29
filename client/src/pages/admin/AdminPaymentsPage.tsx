import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
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
import { formatPrice } from '../../lib/utils/format.ts';

export default function AdminPaymentsPage() {
  const { transactions, status: requestStatus, error } = useAdminStore();
  const transactionsHistory = useAdminStore((state) => state.transactionsHistory);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const limit = 10;
  const rows = useMemo(
    () =>
      transactions.items.filter(
        (p) =>
          `${p.customer} ${p.transaction} ${p.email}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [query, transactions.items],
  );

  useEffect(() => {
    void transactionsHistory(page, limit, status);
  }, [page, status, transactionsHistory]);

  return (
    <>
      <PageTitle
        title="Payments"
        description="Review transactions and payment outcomes."
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
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        {error && <p className="mb-4 text-sm font-semibold text-red-600">{error}</p>}
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
                <TableCell className="font-bold">{p?.transaction}</TableCell>
                <TableCell>
                  <p className="font-semibold">{p?.customer}</p>
                  <p className="text-xs text-navy-500">{p?.email}</p>
                </TableCell>
                <TableCell>{new Date(p?.date).toLocaleDateString('en-BD')}</TableCell>
                <TableCell>
                  <Badge className={statusTone(p?.status)}>{p.status}</Badge>
                </TableCell>
                <TableCell className="text-right font-black">{formatPrice(p?.amount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {requestStatus !== 'loading' && !rows.length && (
          <p className="py-12 text-center text-sm text-navy-500">No transactions found.</p>
        )}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-5">
          <p className="text-sm text-navy-500">
            {transactions.meta.totalItems} transactions · Page {transactions.meta.page} of{' '}
            {transactions.meta.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={page <= 1 || requestStatus === 'loading'}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              <ChevronLeft className="size-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={page >= transactions.meta.totalPages || requestStatus === 'loading'}
              onClick={() =>
                setPage((current) => Math.min(transactions.meta.totalPages, current + 1))
              }
            >
              Next
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </Panel>
    </>
  );
}
