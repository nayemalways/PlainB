import { formatPrice } from '../../../lib/utils/format.ts';
import type { Product } from '../types/product.types.ts';

export function ProductPrice({ product, large = false }: { product: Product; large?: boolean }) {
  return (
    <div className={`flex flex-wrap items-baseline gap-2 ${large ? 'text-2xl' : 'text-base'}`}>
      <strong className="text-navy-950 dark:text-white">
        {formatPrice(product.discount ? product.discountPrice : product.price)}
      </strong>
      {product.discount && (
        <span className="text-sm text-navy-400 line-through">{formatPrice(product.price)}</span>
      )}
    </div>
  );
}
