import { PaymentStatus } from '../invoice/invoice.interface.ts';
import InvoiceModel from '../invoice/invoice.model.ts';
import ProductModel from '../product/product.model.ts';
import User from '../user/user.model.ts';

interface MonthlyRevenue {
  month: string;
  revenue: number;
}

interface RevenueAggregationResult {
  _id: {
    year: number;
    month: number;
  };
  revenue: number;
}

// DASHBOARD ANALYTICS
const dashboardAnalytics = async () => {
  const totalUserPromise = User.countDocuments();
  const totalProductsPromise = ProductModel.countDocuments();
  const totalRevenuesPromise = await InvoiceModel.aggregate([
    {
      $match: {
        payment_status: PaymentStatus.PAID,
      },
    },

    {
      $group: {
        _id: null,
        totalRevenue: { $sum: { $toDouble: '$total' } },
        totalPaidTransactions: {
        $sum: 1,
      }
      },
    },
  ]);

  const [totalUser, totalProducts, totalRevenue] = await Promise.all([
    totalUserPromise,
    totalProductsPromise,
    totalRevenuesPromise
  ]);

//   const totalPayment = totalRevenue.length;

  return {
    // totalPayment,
    totalProducts,
    payment: totalRevenue[0],
    totalUser,
  };
};

// PLATFORM REVENUE TRENDS
const getRevenueTrends = async (): Promise<MonthlyRevenue[]> => {
  const now = new Date();

  // UTC boundaries keep the aggregation deterministic across server environments.
  const currentMonthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const rangeStart = new Date(
    Date.UTC(currentMonthStart.getUTCFullYear(), currentMonthStart.getUTCMonth() - 5, 1),
  );
  const rangeEnd = new Date(
    Date.UTC(currentMonthStart.getUTCFullYear(), currentMonthStart.getUTCMonth() + 1, 1),
  );

  // Filter before grouping so MongoDB can use the payment status/date compound index.
  const aggregatedRevenue = await InvoiceModel.aggregate<RevenueAggregationResult>([
    {
      $match: {
        payment_status: PaymentStatus.PAID,
        createdAt: { $gte: rangeStart, $lt: rangeEnd },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        revenue: {
          $sum: {
            // Historical invoice totals are strings; malformed values safely contribute zero.
            $convert: { input: '$total', to: 'double', onError: 0, onNull: 0 },
          },
        },
      },
    },
  ]);

  const revenueByMonth = new Map(
    aggregatedRevenue.map(({ _id, revenue }) => [`${_id.year}-${_id.month}`, revenue]),
  );
  const monthFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    timeZone: 'UTC',
  });

  // Generate all six entries so months without paid invoices are returned with zero revenue.
  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(
      Date.UTC(rangeStart.getUTCFullYear(), rangeStart.getUTCMonth() + index, 1),
    );
    const key = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}`;

    return {
      month: monthFormatter.format(date),
      revenue: revenueByMonth.get(key) ?? 0,
    };
  });
};

export const dashboardServices = {
  dashboardAnalytics,
  getRevenueTrends,
};
