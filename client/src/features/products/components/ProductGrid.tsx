import { EmptyState, ErrorState, LoadingGrid } from '../../../components/feedback/AsyncState.tsx';
import type { RequestStatus } from '../../../types/api.ts';
import type { Product } from '../types/product.types.ts';
import { ProductCard } from './ProductCard.tsx';

export function ProductGrid({
  products,
  status,
  error,
  retry,
}: {
  products: Product[];
  status: RequestStatus;
  error?: string | null;
  retry?: () => void;
}) {
  if (status === 'loading' || status === 'idle') return <LoadingGrid />;
  if (status === 'error') return <ErrorState message={error ?? 'Unable to load products.'} retry={retry} />;
  if (!products.length) return <EmptyState title="No products found" message="Try changing your search or filters." />;
  return <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{products.map((product) => <ProductCard key={product._id} product={product} />)}</div>;
}
