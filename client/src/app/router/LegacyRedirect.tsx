import { Navigate, useParams } from 'react-router-dom';

export function LegacyProductRedirect() {
  const { id } = useParams();
  return <Navigate replace to={`/products/${id ?? ''}`} />;
}
export function LegacySearchRedirect() {
  const { keyword } = useParams();
  return <Navigate replace to={`/search?q=${encodeURIComponent(keyword ?? '')}`} />;
}
export function LegacyOrderRedirect() {
  const { invoiceId } = useParams();
  return <Navigate replace to={invoiceId ? `/account/orders/${invoiceId}` : '/account/orders'} />;
}
