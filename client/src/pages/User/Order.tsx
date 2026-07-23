import Layout from '../../components/layout/Layout.tsx';
import InvoiceStore from '../../store/invoiceStore.ts';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Order = () => {
  const { invoiceListRequest, invoiceList, isLoading } = InvoiceStore();

  useEffect(() => {
    (async () => {
      await invoiceListRequest();
    })();
  }, [invoiceListRequest]);

  // Date conversion
  //   const isoDate = "2025-10-04T17:18:29.924Z";

  const dateConversion = (isoDate: string) => {
    const date = new Date(isoDate);

    const readableDate = date.toLocaleString('en-US', {
      day: 'numeric',
      month: 'long', // e.g., June
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true, // show AM/PM
    });

    return readableDate;
  };

  const getBadgeClass = (status: string) => {
    switch (status) {
      case 'paid':
      case 'success':
        return 'bg-success';
      case 'pending':
        return 'bg-warning text-dark';
      case 'failed':
        return 'bg-danger';
      case 'cancelled':
      case 'cancel':
        return 'bg-secondary';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <Layout>
      <div className="container my-5">
        <h2 className="mb-4 fw-bold text-center text-decoration-underline">Order List</h2>
        {isLoading && <p className="text-center">Loading orders...</p>}
        {!isLoading && invoiceList.length === 0 && (
          <p className="text-center text-muted">No orders found.</p>
        )}
        <div className="row g-4">
          {invoiceList.map((order) => (
            <div className="col-md-6 col-lg-4" key={order._id}>
              <div className="card shadow-sm border-0 rounded-3 h-100">
                <div className="card-body">
                  <h5 className="card-title fw-semibold">Amount: {order.payable} TK</h5>
                  <p className="text-muted mb-1">
                    <strong>Transaction ID:</strong> {order.tran_id}
                  </p>
                  <p className="mb-2">
                    <strong>Payment Status:</strong>
                    <span className={`badge ${getBadgeClass(order.payment_status)}`}>
                      {order.payment_status}
                    </span>
                  </p>
                  <div className="d-flex justify-content-around align-items-center">
                    <p className="pt-3 text-secondary">{dateConversion(order?.createdAt)}</p>
                    <Link
                      to={`/order/${order._id}`}
                      className="btn btn-outline-success btn-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Order;
