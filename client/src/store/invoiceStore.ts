import { create } from 'zustand';
import axios from 'axios';
import { BaseServerUrl } from '../utility/utility.ts';
import Cookies from 'js-cookie';

interface InvoiceState {
  invoiceList: any[];
  invoiceListRequest: () => Promise<void>;
  invoiceDetails: any;
  invoiceDetailsRequest: (invoiceId: string) => Promise<void>;
}

const InvoiceStore = create<InvoiceState>()((set) => ({
  invoiceList: [],
  invoiceListRequest: async () => {
    try {
      set({ invoiceList: [] });
      const config = { headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` } };
      const res = await axios.get(`${BaseServerUrl}/api/InvoiceList`, config);

      if (res?.data?.status === 'Success') {
        set({ invoiceList: res?.data['data'].reverse() });
      }
    } catch (error) {
      console.error('Error fetching invoice list:', error);
    }
  },

  invoiceDetails: [],
  invoiceDetailsRequest: async (invoiceId) => {
    try {
      set({ invoiceList: [] });
      const config = { headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` } };
      const res = await axios.get(`${BaseServerUrl}/api/InvoiceProductList/${invoiceId}`, config);

      if (res?.data?.status === 'Success') {
        set({ invoiceDetails: res?.data['data'] });
      }
    } catch (error) {
      console.error('Error fetching invoice details:', error);
    }
  },
}));

export default InvoiceStore;
