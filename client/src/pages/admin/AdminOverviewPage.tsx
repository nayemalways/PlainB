import { ArrowUpRight, Boxes, CreditCard, Package, Users } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Badge } from '../../components/ui/badge.tsx';
import { Button } from '../../components/ui/button.tsx';
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



export default function AdminOverviewPage() {
  const { products, inventory, transactions, dashboardOverview, revenueSeries } = useAdminStore();
  const transactionsHistory = useAdminStore((state) => state.transactionsHistory);

  useEffect(() => {
    void transactionsHistory(1, 5, 'all');
  }, [transactionsHistory]);

  const metrics = [
    ['Total users', dashboardOverview?.totalUser, Users, false],
    ['Total products', dashboardOverview?.totalProducts, Package, false],
    ['Revenue', formatPrice(dashboardOverview?.payment?.totalRevenue), ArrowUpRight, false],
    ['Payments', dashboardOverview?.payment?.totalPaidTransactions, CreditCard, false],
  ] as const;

  const low = inventory.filter((item) => item.quantity <= 8);
  return (
    <>
      <PageTitle
        title="Business overview"
        description="A focused view of store performance and operational priorities."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([label, value, Icon, demo]) => (
          <Panel key={label}>
            <div className="flex items-center justify-between">
              <span className="grid size-10 place-items-center rounded-lg bg-brand-50 text-brand-700">
                <Icon className="size-5" />
              </span>
              {demo && <span className="text-[10px] font-bold uppercase text-amber-600">Demo</span>}
            </div>
            <p className="mt-5 text-sm font-semibold text-navy-500">{label}</p>
            <p className="mt-1 text-2xl font-black">{value}</p>
          </Panel>
        ))}
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <Panel>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black">Revenue trend</h3>
              <p className="text-xs text-navy-500">Six-month demonstration</p>
            </div>
          </div>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries}>
                <defs>
                  <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#21bf73" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#21bf73" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} />
                <YAxis tickLine={false} width={70} />
                <Tooltip formatter={(value) => formatPrice(Number(value))} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#15995a"
                  strokeWidth={3}
                  fill="url(#revenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel>
          <div className="flex items-center justify-between">
            <h3 className="font-black">Inventory attention</h3>
            <Badge className="bg-navy-50 text-navy-600">
              <Boxes className="mr-1 size-3" />
              {low.length}
            </Badge>
          </div>
          <div className="mt-4 space-y-3">
            {low.slice(0, 5).map((item) => {
              const product = products.find((p) => p._id === item.productId);
              return (
                <div
                  className="flex items-center justify-between border-b pb-3"
                  key={item.productId}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{product?.title || 'Product'}</p>
                    <p className="text-xs text-navy-500">{item.quantity} units remaining</p>
                  </div>
                  <Badge className={statusTone(item.quantity ? 'low' : 'out')}>
                    {item.quantity ? 'Low' : 'Out'}
                  </Badge>
                </div>
              );
            })}
            {!low.length && (
              <p className="py-12 text-center text-sm text-navy-500">No low-stock products.</p>
            )}
          </div>
          <Button asChild variant="outline" className="mt-4 w-full">
            <Link to="/admin/inventory">Manage inventory</Link>
          </Button>
        </Panel>
      </div>
      <Panel className="mt-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-black">Recent payments</h3>
          <Button asChild variant="ghost" size="sm">
            <Link to="/admin/payments">View all</Link>
          </Button>
        </div>
        <Table>
          <TableHeader>
            <tr>
              <TableHead>Transaction</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            {transactions?.items.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-bold">{payment.transaction}</TableCell>
                <TableCell>{payment.customer}</TableCell>
                <TableCell>
                  <Badge className={statusTone(payment.status)}>{payment.status}</Badge>
                </TableCell>
                <TableCell className="text-right font-black">
                  {formatPrice(payment.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Panel>
    </>
  );
}
