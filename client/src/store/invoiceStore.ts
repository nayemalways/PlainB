import { create } from 'zustand';
import axios from 'axios';
import Cookies from 'js-cookie';
import type {
  IInvoice,
  IInvoiceApiResponse,
  IInvoiceDetails,
  IInvoiceState,
} from '../interfaces/invoice.interface.ts';
import { BaseServerV2Url, unauthorized } from '../utility/utility.ts';

const InvoiceStore = create<IInvoiceState>()((set) => ({
  invoiceList: [],
  invoiceDetails: null,
  isLoading: false,

  invoiceListRequest: async () => {
    try {
      set({ isLoading: true });
      const response = await axios.get<IInvoiceApiResponse<IInvoice[]>>(
        `${BaseServerV2Url}/invoice`,
        { headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` } },
      );
      set({ invoiceList: response.data.data });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        unauthorized(error.response?.status ?? 0, error.response?.data?.message ?? error.message);
      }
      set({ invoiceList: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  invoiceDetailsRequest: async (invoiceId) => {
    try {
      set({ isLoading: true, invoiceDetails: null });
      const response = await axios.get<IInvoiceApiResponse<IInvoiceDetails>>(
        `${BaseServerV2Url}/invoice/${encodeURIComponent(invoiceId)}`,
        { headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` } },
      );
      set({ invoiceDetails: response.data.data });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        unauthorized(error.response?.status ?? 0, error.response?.data?.message ?? error.message);
      }
      set({ invoiceDetails: null });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default InvoiceStore;
