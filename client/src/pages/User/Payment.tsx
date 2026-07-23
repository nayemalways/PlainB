import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link, useLocation } from 'react-router-dom';
import Layout from '../../components/layout/Layout.tsx';
import type { IApiResponse, IPaymentStatus } from '../../interfaces/payment.interface.ts';
import { BaseServerV2Url } from '../../utility/utility.ts';

const Payment = () => {
  const { pathname, search } = useLocation();
  const sessionId = new URLSearchParams(search).get('session_id');
  const invoiceId = new URLSearchParams(search).get('invoice_id');
  const cancelled = pathname.endsWith('/cancel');
  const [payment, setPayment] = useState<IPaymentStatus | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (cancelled && invoiceId) {
      axios
        .patch(
          `${BaseServerV2Url}/payment/cancel/${encodeURIComponent(invoiceId)}`,
          {},
          { headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` } },
        )
        .catch(() => setError('The checkout was cancelled, but the order status could not update.'));
      return;
    }
    if (!sessionId) return;

    let attempts = 0;
    const checkStatus = async () => {
      try {
        const response = await axios.get<IApiResponse<IPaymentStatus>>(
          `${BaseServerV2Url}/payment/status/${encodeURIComponent(sessionId)}`,
          { headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` } },
        );
        setPayment(response.data.data);
        attempts += 1;

        if (response.data.data.status === 'pending' && attempts < 10) {
          window.setTimeout(checkStatus, 1500);
        }
      } catch {
        setError('We could not verify this payment. Please check your orders.');
      }
    };

    checkStatus();
  }, [cancelled, invoiceId, sessionId]);

  const status = cancelled ? 'cancelled' : payment?.status;
  const successful = status === 'paid';
  const verifying = !cancelled && !error && (!payment || status === 'pending');

  return (
    <Layout>
      <div className="container py-5">
        <div className="card mx-auto text-center p-4" style={{ maxWidth: 620 }}>
          <div className="card-body">
            <i
              className={`bi ${successful ? 'bi-check-circle-fill text-success' : verifying ? 'bi-hourglass-split text-warning' : 'bi-x-circle-fill text-danger'} display-3`}
            />
            <h2 className="mt-3">
              {successful
                ? 'Payment successful'
                : verifying
                  ? 'Confirming your payment'
                  : 'Payment not completed'}
            </h2>
            <p className="text-muted">
              {error ||
                (successful
                  ? 'Stripe confirmed your payment and your order is ready for processing.'
                  : verifying
                    ? 'Stripe is processing the payment. This page will update automatically.'
                    : 'Your card was not charged. You can return to the cart and try again.')}
            </p>
            {payment && (
              <div className="bg-light rounded p-3 text-start my-4">
                <div className="d-flex justify-content-between">
                  <span>Transaction</span>
                  <strong>{payment.transactionId}</strong>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <span>Amount</span>
                  <strong>
                    {payment.amount.toFixed(2)} {payment.currency}
                  </strong>
                </div>
              </div>
            )}
            <div className="d-flex justify-content-center gap-2">
              <Link to="/order" className="btn btn-dark">
                View orders
              </Link>
              <Link to={successful ? '/' : '/cart'} className="btn btn-outline-secondary">
                {successful ? 'Continue shopping' : 'Return to cart'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Payment;
