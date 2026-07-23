import { create } from 'zustand';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
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
  isPdfDownloading: false,

  // Load the authenticated user's invoices.
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

  // Load one invoice with its purchased products.
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

  // Generate the invoice on the server and download the returned PDF.
  downloadInvoicePdf: async (invoiceId) => {
    try {
      set({ isPdfDownloading: true });
      const response = await axios.get<Blob>(
        `${BaseServerV2Url}/invoice/${encodeURIComponent(invoiceId)}/pdf`,
        {
          responseType: 'blob',
          headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
        },
      );

      const downloadUrl = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        unauthorized(error.response?.status ?? 0, error.message);
      }
      toast.error('Unable to generate the invoice PDF.');
    } finally {
      set({ isPdfDownloading: false });
    }
  },
}));

export default InvoiceStore;
