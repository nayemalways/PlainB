import { PaymentStatus } from '../invoice/invoice.interface.ts';
import InvoiceModel from '../invoice/invoice.model.ts';
import ProductModel from '../product/product.model.ts';
import User from '../user/user.model.ts';

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

export const dashboardServices = {
  dashboardAnalytics,
};
