import { StatusCodes } from 'http-status-codes';
import AppError from '../../errorHelpers/appError.ts';
import { PaymentStatus } from '../invoice/invoice.interface.ts';
import InvoiceModel from '../invoice/invoice.model.ts';
import ProductModel from '../product/product.model.ts';
import User from '../user/user.model.ts';
import type {
  TransactionHistoryItem,
  TransactionHistoryQuery,
  TransactionHistoryResult,
} from './dashboard.interface.ts';

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

interface TransactionAggregationResult {
  items: TransactionHistoryItem[];
  total: Array<{ count: number }>;
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

// ADMIN TRANSACTION HISTORY
const getTransactionHistory = async (
  query: TransactionHistoryQuery,
): Promise<TransactionHistoryResult> => {
  const page = Math.max(1, Number.parseInt(query.page ?? '1', 10) || 1);
  const requestedLimit = Number.parseInt(query.limit ?? '10', 10) || 10;
  const limit = Math.min(100, Math.max(1, requestedLimit));
  const skip = (page - 1) * limit;

  // Accept "cancel" for client convenience while keeping the stored enum value canonical.
  const requestedStatus = query.status?.trim().toLowerCase();
  const normalizedStatus = requestedStatus === 'cancel' ? PaymentStatus.CANCELLED : requestedStatus;
  const allowedStatuses = new Set<string>([
    PaymentStatus.PAID,
    PaymentStatus.PENDING,
    PaymentStatus.CANCELLED,
  ]);

  if (normalizedStatus && normalizedStatus !== 'all' && !allowedStatuses.has(normalizedStatus)) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Invalid payment status. Use paid, pending, cancelled, or all.',
    );
  }

  const match =
    normalizedStatus && normalizedStatus !== 'all'
      ? { payment_status: normalizedStatus }
      : { payment_status: { $in: [...allowedStatuses] } };

  // Faceting returns the requested page and its total count from one database operation.
  const [result] = await InvoiceModel.aggregate<TransactionAggregationResult>([
    { $match: match },
    { $sort: { createdAt: -1, _id: -1 } },
    {
      $facet: {
        items: [
          { $skip: skip },
          { $limit: limit },
          {
            $lookup: {
              from: 'users',
              localField: 'userID',
              foreignField: '_id',
              as: 'user',
              pipeline: [
                {
                  $project: {
                    _id: 0,
                    email: 1,
                    customerName: '$cus_address.cus_name',
                  },
                },
              ],
            },
          },
          { $set: { user: { $first: '$user' } } },
          {
            $project: {
              _id: 0,
              id: { $toString: '$_id' },
              transaction: '$tran_id',
              customer: { $ifNull: ['$user.customerName', 'Unknown customer'] },
              email: { $ifNull: ['$user.email', ''] },
              amount: {
                $convert: { input: '$payable', to: 'double', onError: 0, onNull: 0 },
              },
              status: '$payment_status',
              date: '$createdAt',
            },
          },
        ],
        total: [{ $count: 'count' }],
      },
    },
  ]);

  const totalItems = result?.total[0]?.count ?? 0;

  return {
    items: result?.items ?? [],
    meta: {
      page,
      limit,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / limit)),
    },
  };
};

export const dashboardServices = {
  dashboardAnalytics,
  getRevenueTrends,
  getTransactionHistory,
};
