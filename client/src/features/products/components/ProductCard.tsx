import { Heart, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Card } from '../../../components/ui/card.tsx';
import type { Product } from '../types/product.types.ts';
import { ProductPrice } from './ProductPrice.tsx';
import { Rating } from './Rating.tsx';

export function ProductCard({ product }: { product: Product }) {
  return (
    <motion.article whileHover={{ y: -4 }} transition={{ duration: 0.18 }}>
      <Card className="group relative h-full overflow-hidden">
        <Link to={`/products/${product._id}`} className="block focus-visible:outline-2">
          <div className="relative aspect-square overflow-hidden bg-navy-50 dark:bg-navy-800">
            <img
              src={product.images[0]}
              alt={product.title}
              loading="lazy"
              className="size-full object-cover transition duration-300 group-hover:scale-105"
            />
            {product.discount && (
              <span className="absolute left-3 top-3 rounded-full bg-amber-400 px-2.5 py-1 text-xs font-extrabold text-navy-950">
                DEAL
              </span>
            )}
            {!product.stock && (
              <span className="absolute inset-x-3 bottom-3 rounded-lg bg-navy-950/85 px-3 py-2 text-center text-xs font-bold text-white">
                Out of stock
              </span>
            )}
          </div>
          <div className="space-y-2 p-4">
            <p className="line-clamp-2 min-h-10 text-sm font-bold">{product.title}</p>
            <Rating value={product.star} />
            <ProductPrice product={product} />
          </div>
        </Link>
        <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
          <span className="grid size-9 place-items-center rounded-full bg-white text-navy-900 shadow" aria-hidden><Heart className="size-4" /></span>
          <span className="grid size-9 place-items-center rounded-full bg-brand-500 text-navy-950 shadow" aria-hidden><ShoppingBag className="size-4" /></span>
        </div>
      </Card>
    </motion.article>
  );
}
