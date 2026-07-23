import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import InvoiceStore from '../../store/invoiceStore.ts';
import Layout from '../../components/layout/Layout.tsx';

const OrderDetails = () => {
  const { invoiceId } = useParams();
  const { invoiceDetails, invoiceDetailsRequest, downloadInvoicePdf, isLoading, isPdfDownloading } =
    InvoiceStore();

  // Fetch invoice details on mount
  useEffect(() => {
    (async () => {
      if (invoiceId) await invoiceDetailsRequest(invoiceId);
    })();
  }, [invoiceDetailsRequest, invoiceId]);

  // Calculate totals
  const total =
    invoiceDetails?.products.reduce(
      (acc, item) => acc + Number(item.price) * Number(item.qty),
      0,
    ) || 0;

  const vat = Number(invoiceDetails?.invoice.vat ?? 0);
  const subtotalWithVat = Number(invoiceDetails?.invoice.payable ?? total + vat);

  // Badge class based on payment status
  const getBadgeClass = (status?: string) => {
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
      {isLoading && <p className="text-center my-5">Loading invoice...</p>}
      {!isLoading && !invoiceDetails && (
        <div className="container my-5 text-center">
          <p className="text-muted">Invoice not found.</p>
          <Link to="/order" className="btn btn-outline-secondary">
            Back to Orders
          </Link>
        </div>
      )}
      {invoiceDetails && (
        <div className="container my-5">
          <div className="card shadow-sm border-0 rounded-3">
            <div className="card-body p-4">
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold">Invoice Details</h3>
                <span
                  className={`badge px-3 py-2 ${getBadgeClass(invoiceDetails.invoice.payment_status)}`}
                >
                  {invoiceDetails.invoice.payment_status.toUpperCase()}
                </span>
              </div>

              {/* Invoice Info */}
              <div className="mb-4">
                <h6 className="mb-1">
                  <strong>Invoice ID:</strong> {invoiceDetails.invoice._id}
                </h6>
                <p className="text-muted mb-1">
                  <strong>Order Date:</strong>{' '}
                  {new Date(invoiceDetails.invoice.createdAt).toLocaleDateString()}
                </p>
                <p className="text-muted">
                  <strong>Order Time:</strong>{' '}
                  {new Date(invoiceDetails.invoice.createdAt).toLocaleTimeString()}
                </p>
              </div>

              {/* Product Table */}
              <div className="table-responsive">
                <table className="table table-bordered align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Product</th>
                      <th>Color / Size</th>
                      <th className="text-center">Qty</th>
                      <th className="text-end">Unit Price (BDT)</th>
                      <th className="text-end">Total (BDT)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceDetails.products.map((item, i) => (
                      <tr key={item._id}>
                        <td>{i + 1}</td>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={item.product.images[0]}
                              alt={item.product.title}
                              className="rounded"
                              style={{
                                width: '70px',
                                height: '70px',
                                objectFit: 'cover',
                              }}
                            />
                            <div>
                              <h6 className="mb-1 fw-semibold">{item.product.title}</h6>
                              <small className="text-muted">
                                {item.product.des.slice(0, 40)}...
                              </small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span style={{ backgroundColor: item.color }} className="badge me-2">
                            {item.color}
                          </span>
                          <span className="badge bg-light text-dark">Size: {item.size}</span>
                        </td>
                        <td className="text-center">{Number(item.qty)}</td>
                        <td className="text-end">{item.price}</td>
                        <td className="text-end fw-bold">
                          {Number(item.price) * Number(item.qty)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="table-secondary">
                      <td colSpan={5} className="text-end fw-bold">
                        Total
                      </td>
                      <td className="text-end fw-bold">{total} BDT</td>
                    </tr>
                    <tr className="table-secondary">
                      <td colSpan={5} className="text-end fw-bold">
                        VAT (5%)
                      </td>
                      <td className="text-end fw-bold">{vat} BDT</td>
                    </tr>
                    <tr className="table-secondary">
                      <td colSpan={5} className="text-end fw-bold">
                        Subtotal
                      </td>
                      <td className="text-end fw-bold">{subtotalWithVat} BDT</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Footer Buttons */}
              <div className="d-flex justify-content-end mt-3">
                <Link to="/order" className="btn btn-outline-secondary me-2">
                  Back to Orders
                </Link>
                <button
                  className="btn btn-primary"
                  onClick={() => invoiceId && downloadInvoicePdf(invoiceId)}
                  disabled={isPdfDownloading}
                >
                  {isPdfDownloading ? 'Generating PDF...' : 'Download Invoice'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default OrderDetails;
