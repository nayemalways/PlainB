import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Product } from '../types/product.types.ts';
import { ProductPrice } from './ProductPrice.tsx';

const product: Product = {
  _id: '1',
  title: 'Test product',
  price: '1200',
  discount: true,
  discountPrice: '950',
  images: [],
  des: '',
  color: 'Black',
  size: 'Standard',
  star: '4',
  stock: true,
  remark: 'new',
};

describe('ProductPrice', () => {
  it('shows the discounted and previous prices in BDT', () => {
    render(<ProductPrice product={product} />);
    expect(screen.getByText(/950/)).toBeInTheDocument();
    expect(screen.getByText(/1,200/)).toBeInTheDocument();
  });
});
