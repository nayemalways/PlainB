import React from "react";
import Layout from "../../components/layout/Layout";
import InvoiceStore from "../../store/invoiceStore";
import { useEffect } from "react";
import { Link } from "react-router-dom";


const Order = () => {
  const orders = [
    {
      id: 1,
      productName: "Product Name",
      transactionId: "#TRX123456",
      status: "Paid",
    },
    {
      id: 2,
      productName: "Another Product",
      transactionId: "#TRX789012",
      status: "Pending",
    },
    {
      id: 3,
      productName: "Third Product",
      transactionId: "#TRX345678",
      status: "Failed",
    },
  ];

  const {invoiceListRequest, invoiceList} =  InvoiceStore();

  useEffect(() => {
   (async () => {
     await invoiceListRequest();
   })()
  }, [])


  // Date conversion
//   const isoDate = "2025-10-04T17:18:29.924Z";

  const dateConversion = (isoDate) => {
    const date = new Date(isoDate);

    const readableDate = date.toLocaleString("en-US", {
    day: "numeric",
    month: "long",     // e.g., June
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true       // show AM/PM
    });

    return readableDate;
  }
   

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

  return (
    <Layout>
        <div className="container my-5">
      <h2 className="mb-4 fw-bold text-center text-decoration-underline">Order List</h2>
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
                  <Link to={`/order/${order?._id}/${order?.payment_status}`} className="btn btn-outline-success btn-sm">
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
