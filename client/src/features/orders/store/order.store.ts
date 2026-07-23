import { create } from 'zustand';
import { api } from '../../../lib/api/client.ts';
import { getErrorMessage } from '../../../lib/utils/format.ts';
import type { ApiResponse, RequestStatus } from '../../../types/api.ts';
import type { Invoice, InvoiceDetails } from '../types/order.types.ts';

interface OrderState {
  orders: Invoice[];
  details: InvoiceDetails | null;
  status: RequestStatus;
  downloading: boolean;
  error: string | null;
  load: () => Promise<void>;
  loadDetails: (id: string) => Promise<void>;
  downloadPdf: (id: string) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  details: null,
  status: 'idle',
  downloading: false,
  error: null,
  load: async () => {
    set({ status: 'loading', error: null });
    try {
      const { data } = await api.get<ApiResponse<Invoice[]>>('/invoice');
      set({ orders: data.data, status: 'success' });
    } catch (error) {
      set({ orders: [], status: 'error', error: getErrorMessage(error) });
    }
  },
  loadDetails: async (id) => {
    set({ details: null, status: 'loading', error: null });
    try {
      const { data } = await api.get<ApiResponse<InvoiceDetails>>(`/invoice/${id}`);
      set({ details: data.data, status: 'success' });
    } catch (error) {
      set({ status: 'error', error: getErrorMessage(error) });
    }
  },
  downloadPdf: async (id) => {
    set({ downloading: true });
    try {
      const response = await api.get<Blob>(`/invoice/${id}/pdf`, { responseType: 'blob' });
      const url = URL.createObjectURL(response.data);
      const link = Object.assign(document.createElement('a'), { href: url, download: `invoice-${id}.pdf` });
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } finally {
      set({ downloading: false });
    }
  },
}));
