import { Star } from 'lucide-react';

export function Rating({ value, showValue = false }: { value: string | number; showValue?: boolean }) {
  const rating = Math.max(0, Math.min(5, Number(value) || 0));
  return (
    <span className="inline-flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          aria-hidden
          className={`size-4 ${index < Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-navy-300 dark:text-navy-600'}`}
        />
      ))}
      {showValue && <span className="ml-1 text-xs font-semibold text-navy-500">{rating.toFixed(1)}</span>}
    </span>
  );
}
