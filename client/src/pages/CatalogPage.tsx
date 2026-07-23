import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, X } from 'lucide-react';
import { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { PageContainer } from '../components/common/PageContainer.tsx';
import { Button } from '../components/ui/button.tsx';
import { ProductGrid } from '../features/products/components/ProductGrid.tsx';
import { useProductStore } from '../features/products/store/product.store.ts';
import type { ProductQuery, ProductSort } from '../features/products/types/product.types.ts';

export default function CatalogPage({ mode = 'search' }: { mode?: 'search' | 'brand' | 'category' }) {
  const route = useParams();
  const [params, setParams] = useSearchParams();
  const { products, meta, status, error, search, loadByBrand, loadByCategory } = useProductStore();
  const query = params.get('q')?.trim() ?? '';
  const page = Math.max(1, Number(params.get('page')) || 1);
  const sort = (params.get('sort') as ProductSort | null) ?? 'newest';
  const priceMin = Number(params.get('priceMin')) || undefined;
  const priceMax = Number(params.get('priceMax')) || undefined;
  useEffect(() => {
    const request: ProductQuery = { page, limit: 12, sort, priceMin, priceMax };
    if (mode === 'brand' && route.brandId) void loadByBrand(route.brandId, request);
    else if (mode === 'category' && route.categoryId) void loadByCategory(route.categoryId, request);
    else if (query) {
      const timer = window.setTimeout(() => void search(query, request), 250);
      return () => window.clearTimeout(timer);
    }
  }, [loadByBrand, loadByCategory, mode, page, priceMax, priceMin, query, route.brandId, route.categoryId, search, sort]);

  const update = (key: string, value?: string) => {
    const next = new URLSearchParams(params);
    value ? next.set(key, value) : next.delete(key);
    if (key !== 'page') next.set('page', '1');
    setParams(next);
  };
  const title = mode === 'brand' ? 'Products by brand' : mode === 'category' ? 'Products by category' : query ? `Results for “${query}”` : 'Explore products';

  return (
    <PageContainer className="py-10 sm:py-14">
      <div className="rounded-4xl bg-navy-950 px-6 py-10 text-white sm:px-10">
        <p className="text-sm font-extrabold tracking-widest text-brand-400">PLAINB CATALOG</p>
        <h1 className="mt-2 text-3xl font-black sm:text-4xl">{title}</h1>
        {mode === 'search' && (
          <form className="relative mt-7 max-w-2xl" onSubmit={(event) => { event.preventDefault(); const input = new FormData(event.currentTarget).get('q')?.toString().trim(); update('q', input); }}>
            <input name="q" defaultValue={query} aria-label="Search products" placeholder="What are you looking for?" className="h-13 w-full rounded-xl border-white/20 bg-white/10 px-4 pr-28 text-white placeholder:text-navy-300" />
            <Button className="absolute right-1 top-1" type="submit"><Search className="size-4" />Search</Button>
          </form>
        )}
      </div>
      <div className="my-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-bold text-navy-500 dark:text-navy-300"><SlidersHorizontal className="size-4" />{meta.totalItems} products</div>
        <div className="flex items-center gap-3">
          {query && <Button variant="ghost" size="sm" onClick={() => update('q')}><X className="size-4" />Clear</Button>}
          <label className="flex items-center gap-2 text-sm font-bold">
            Sort
            <select value={sort} onChange={(event) => update('sort', event.target.value)} className="h-11 rounded-xl border bg-white px-3 dark:bg-navy-900">
              <option value="newest">Newest</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="rating">Rating</option>
            </select>
          </label>
        </div>
      </div>
      <form
        className="mb-8 flex flex-wrap items-end gap-3 rounded-xl border bg-white p-4 dark:bg-navy-900"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const next = new URLSearchParams(params);
          const minimum = data.get('priceMin')?.toString().trim();
          const maximum = data.get('priceMax')?.toString().trim();
          minimum ? next.set('priceMin', minimum) : next.delete('priceMin');
          maximum ? next.set('priceMax', maximum) : next.delete('priceMax');
          next.set('page', '1');
          setParams(next);
        }}
      >
        <label className="text-sm font-bold">Minimum price<input name="priceMin" type="number" min="0" defaultValue={priceMin} className="mt-2 block h-11 w-36 rounded-xl border bg-white px-3 dark:bg-navy-800" /></label>
        <label className="text-sm font-bold">Maximum price<input name="priceMax" type="number" min="0" defaultValue={priceMax} className="mt-2 block h-11 w-36 rounded-xl border bg-white px-3 dark:bg-navy-800" /></label>
        <Button type="submit" variant="outline">Apply price filter</Button>
        {(priceMin || priceMax) && <Button type="button" variant="ghost" onClick={() => { const next = new URLSearchParams(params); next.delete('priceMin'); next.delete('priceMax'); next.set('page', '1'); setParams(next); }}>Clear prices</Button>}
      </form>
      {!query && mode === 'search' ? (
        <div className="grid min-h-72 place-items-center text-center"><div><Search className="mx-auto size-12 text-brand-500" /><h2 className="mt-4 text-xl font-black">Search the marketplace</h2><p className="mt-2 text-navy-500">Enter a product name above to begin.</p></div></div>
      ) : <ProductGrid products={products} status={status} error={error} />}
      {meta.totalPages > 1 && (
        <nav aria-label="Product pages" className="mt-10 flex items-center justify-center gap-3">
          <Button variant="outline" disabled={page <= 1} onClick={() => update('page', String(page - 1))}><ChevronLeft className="size-4" />Previous</Button>
          <span className="text-sm font-bold">Page {page} of {meta.totalPages}</span>
          <Button variant="outline" disabled={page >= meta.totalPages} onClick={() => update('page', String(page + 1))}>Next<ChevronRight className="size-4" /></Button>
        </nav>
      )}
    </PageContainer>
  );
}
