import { create } from 'zustand';
import axios from 'axios';
import { BaseServerUrl } from '../utility/utility';
import  Cookies  from 'js-cookie';

const InvoiceStore = create((set) => ({
    invoiceList: [],
    invoiceListRequest: async () => {
        try {
            set( {invoiceList: [] });
            let config = { headers: { token: Cookies.get('token')}}; // Ensure user logged in
            let res = await axios.get(`${BaseServerUrl}/api/InvoiceList`, config);

            if(res?.data?.status === 'Success') {
                set({ invoiceList: res?.data['data'].reverse() });
            }
        }catch(error) {
            console.error('Error fetching invoice list:', error);
        }
    },

    invoiceDetails: [],
    invoiceDetailsRequest: async (invoiceId) => {
        try {
            set( {invoiceList: []});
            let config = { headers: { token: Cookies.get('token')}}; // Ensure user logged in
            let res = await axios.get(`${BaseServerUrl}/api/InvoiceProductList/${invoiceId}`, config);

            if(res?.data?.status === 'Success') {
                set({ invoiceDetails: res?.data['data'] });
            }

        }catch(error) {
            console.error('Error fetching invoice details:', error);
        }
    },


}))




export default InvoiceStore;