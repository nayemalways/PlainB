import type { Brand, Category, Product } from '../products/types/product.types.ts';
import type { PaginationMeta, RequestStatus } from '../../types/api.ts';

export interface AdminPayment {
  id: string;
  transaction: string;
  customer: string;
  email: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  date: string;
}
export interface dashboardOverview {
        totalProducts: number,
        payment: {
            _id: null,
            totalRevenue: number,
            totalPaidTransactions: number
        },
        totalUser: number
}
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'blocked';
  joined: string;
  orders: number;
  spent: number;
}
export interface InventoryItem {
  productId: string;
  quantity: number;
  available: boolean;
}
export interface AdminSettings {
  storeName: string;
  supportEmail: string;
  currency: string;
  lowStockThreshold: number;
  emailPayments: boolean;
  emailStock: boolean;
}
export interface ProductInput {
  title: string;
  price: string;
  discount: boolean;
  discountPrice: string;
  des: string;
  color: string;
  size: string;
  star: string;
  stock: boolean;
  remark: string;
  categoryId: string;
  brandId: string;
  images: File[];
}
export interface AdminState {
  products: Product[];
  brands: Brand[];
  categories: Category[];
  meta: PaginationMeta;
  inventory: InventoryItem[];
  payments: AdminPayment[];
  revenueSeries: { month: string, revenue: number }[]
  dashboardOverview: dashboardOverview ;
  settings: AdminSettings;
  status: RequestStatus;
  error: string | null;
  loaded: boolean;
  dashboardAnalytics: () => Promise<void>;
  revenueTrends: () => Promise<void>;
  loadCatalog: () => Promise<void>;
  createProduct: (input: ProductInput) => Promise<void>;
  createBrand: (name: string, file: File) => Promise<void>;
  createCategory: (name: string, file: File) => Promise<void>;
  removeDemoProduct: (id: string) => void;
  updateInventory: (id: string, quantity: number, available: boolean) => void;
  updateSettings: (settings: Partial<AdminSettings>) => void;
}
