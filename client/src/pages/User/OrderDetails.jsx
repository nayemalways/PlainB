import React, { useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import InvoiceStore from "../../store/invoiceStore";
import Layout from "../../components/layout/Layout";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const OrderDetails = () => {
  const { invoiceId, payment_status } = useParams();
  const { invoiceDetails, invoiceDetailsRequest } = InvoiceStore();

  const invoiceRef = useRef();

  // Fetch invoice details on mount
  useEffect(() => {
    (async () => {
      await invoiceDetailsRequest(invoiceId);
    })();
  }, [invoiceId]);

  // Calculate totals
  const total =
    invoiceDetails?.data?.reduce(
      (acc, item) => acc + Number(item.product.price) * Number(item.qty),
      0
    ) || 0;

  const vat = total * 0.05; // 5% VAT
  const subtotalWithVat = total + vat;

  // Badge class based on payment status
  const getBadgeClass = (status) => {
    switch (status) {
      case "success":
        return "bg-success";
      case "pending":
        return "bg-warning text-dark";
      case "failed":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  // Download PDF function
  const downloadPDF = () => {
    const input = invoiceRef.current;
    if (!input) return;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice-${invoiceId}.pdf`);
    });
  };

  return (
    <Layout>
      <div className="container my-5" ref={invoiceRef}>
        <div className="card shadow-sm border-0 rounded-3">
          <div className="card-body p-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-bold">Invoice Details</h3>
              <span className={`badge px-3 py-2 ${getBadgeClass(payment_status)}`}>
                {payment_status?.toUpperCase() || "Pending"}
              </span>
            </div>

            {/* Invoice Info */}
            <div className="mb-4">
              <h6 className="mb-1">
                <strong>Invoice ID:</strong> {invoiceDetails?.invoice_id || invoiceId}
              </h6>
              <p className="text-muted mb-1">
                <strong>Order Date:</strong>{" "}
                {invoiceDetails?.order_date
                  ? new Date(invoiceDetails.order_date).toLocaleDateString()
                  : "-"}
              </p>
              <p className="text-muted">
                <strong>Order Time:</strong>{" "}
                {invoiceDetails?.order_date
                  ? new Date(invoiceDetails.order_date).toLocaleTimeString()
                  : "-"}
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
                  {invoiceDetails?.data &&
                    invoiceDetails.data.map((item, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={item.product.image}
                              alt={item.product.title}
                              className="rounded"
                              style={{
                                width: "70px",
                                height: "70px",
                                objectFit: "cover",
                              }}
                            />
                            <div>
                              <h6 className="mb-1 fw-semibold">{item.product.title}</h6>
                              <small className="text-muted">
                                {item.product.shortDes.slice(0, 40)}...
                              </small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span
                            style={{ backgroundColor: item.color }}
                            className="badge me-2"
                          >
                            {item.color}
                          </span>
                          <span className="badge bg-light text-dark">
                            Size: {item.size}
                          </span>
                        </td>
                        <td className="text-center">{Number(item.qty)}</td>
                        <td className="text-end">{item.product.price}</td>
                        <td className="text-end fw-bold">
                          {Number(item.product.price) * Number(item.qty)}
                        </td>
                      </tr>
                    ))}
                </tbody>
                <tfoot>
                  <tr className="table-secondary">
                    <td colSpan="5" className="text-end fw-bold">
                      Total
                    </td>
                    <td className="text-end fw-bold">{total} BDT</td>
                  </tr>
                  <tr className="table-secondary">
                    <td colSpan="5" className="text-end fw-bold">
                      VAT (5%)
                    </td>
                    <td className="text-end fw-bold">{vat} BDT</td>
                  </tr>
                  <tr className="table-secondary">
                    <td colSpan="5" className="text-end fw-bold">
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
              <button className="btn btn-primary" onClick={downloadPDF}>
                Download Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderDetails;
