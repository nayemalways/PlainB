/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import axios from 'axios';
import { BaseServerUrl, BaseServerV2Url, unauthorized } from '../utility/utility.ts';
import Cookies from 'js-cookie';

interface CartState {
  isCartSubmit: boolean;
  cartForm: Record<string, string>;
  cartFormOnchange: (name: string, value: string) => void;
  SaveCartRequest: (payload: Record<string, unknown>, productID: string, quantity: number) => Promise<boolean | string | undefined>;
  CartList: any[] | null;
  CartCount: number;
  CartTotal: number;
  CartVatTotal: number;
  CartPayable: number;
  CartListRequest: () => Promise<void>;
  removeCartProduct: (productID: string) => Promise<boolean | string | undefined>;
  isCheckout: boolean;
  createInvoice: () => Promise<void>;
}

const CartStore = create<CartState>()((set) => ({
  isCartSubmit: false,
  cartForm: { productID: '', color: '', size: '' },
  cartFormOnchange: (name, value) => {
    set((state) => ({
      cartForm: {
        ...state.cartForm,
        [name]: value,
      },
    }));
  },

  // Add to Cart Request
  SaveCartRequest: async (payload, productId, quantity) => {
    try {
      set({ isCartSubmit: true });
      payload.productId = productId; // added product id into payload
      payload.qty = quantity;
      const config = { headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` } };
      const res = await axios.post(`${BaseServerV2Url}/cart`, payload, config); // Api call

      return res.data;
    } catch (e) {
      unauthorized(e.response.status);
      console.log(e.toString());
    } finally {
      set({ isCartSubmit: false });
    }
  },

  CartList: null,
  CartCount: 0,
  CartTotal: 0,
  CartVatTotal: 0,
  CartPayable: 0,
  CartListRequest: async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` } };
      const res = await axios.get(`${BaseServerV2Url}/cart`, config);

      set({ CartList: res.data['data'] });
      set({ CartCount: res.data['data'].length });

      // Calculating
      let total = 0;
      let vat = 0;
      let payable = 0;

      res?.data['data'].forEach((item) => {
        if (item['product']['discount'] === false) {
          total += parseFloat(item?.product['price']) * parseFloat(item['qty']);
        } else {
          total += parseFloat(item?.product['discountPrice']) * parseFloat(item['qty']);
        }
      });

      vat = total * 0.05;
      payable = vat + total;
      set({ CartTotal: total });
      set({ CartVatTotal: vat });
      set({ CartPayable: payable });

      return;
    } catch (e) {
      unauthorized(e.response.status);
      console.log(e.toString());
    }
  },

  // Product remove from cart list
  removeCartProduct: async (productID) => {
    try {
      const config = { headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` } };
      const postBody = { productID };
      const res = await axios.post(`${BaseServerV2Url}/${productID}`, postBody, config);
      return res.data['status'] === 'Success' ? true : res.data['message'];
    } catch (e) {
      unauthorized(e.response.status);
      console.log(e.toString());
    }
  },

  // Checkout to payment page
  isCheckout: false,
  createInvoice: async () => {
    try {
      set({ isCheckout: true });
      const config = { headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` } };
      const res = await axios.get(`${BaseServerV2Url}/api/CreateInvoice`, config);
      set({ isCheckout: true });
      window.location.href = res['data']['data']['GatewayPageURL'];
    } catch (e) {
      // unauthorized(e.response.status);
      console.log(e.toString());
    }
  },
}));

export default CartStore;
