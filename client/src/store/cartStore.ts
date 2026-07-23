/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import axios from 'axios';
import { BaseServerV2Url, unauthorized } from '../utility/utility.ts';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

interface CartResponse {
  success: boolean;
  message: string;
}

interface CartState {
  isCartSubmit: boolean;
  cartForm: Record<string, string>;
  cartFormOnchange: (name: string, value: string) => void;
  saveToCart: (
    payload: Record<string, unknown>,
    productID: string,
    quantity: number,
  ) => Promise<boolean | string | undefined>;
  CartList: any[] | null;
  CartCount: number;
  CartTotal: number;
  CartVatTotal: number;
  CartPayable: number;
  CartListRequest: () => Promise<void>;
  removeCartProduct: (productID: string) => Promise<CartResponse | undefined>;
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
  saveToCart: async (payload, productId, quantity) => {
    try {
      set({ isCartSubmit: true });
      payload.productId = productId; // added product id into payload
      payload.qty = quantity;
      const config = { headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` } };
      const res = await axios.post(`${BaseServerV2Url}/cart`, payload, config); // Api call

      if (res.data?.success) {
        toast.success('Added to cart');
        return res.data;
      }

      return null;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        unauthorized(e.response?.status ?? 0, e.response?.data?.message ?? e.message);
        toast.error(e.response?.data?.message ?? 'Unable to add product to cart');
      }
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
      if (axios.isAxiosError(e)) {
        unauthorized(e.response?.status ?? 0, e.response?.data?.message ?? e.message);
      }
      console.log(e);
    }
  },

  // Product remove from cart list
  removeCartProduct: async (productId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get('accessToken')}`,
        }
      };

      const res = await axios.delete<CartResponse>(
        `${BaseServerV2Url}/cart/${productId}`,
        config,
      );
      if (res.data.success) {
        return res.data;
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        unauthorized(e.response?.status ?? 0, e.response?.data?.message ?? e.message);
        toast.error(e.response?.data?.message ?? 'Unable to remove product');
      }
      console.log(e);
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
      if (axios.isAxiosError(e)) {
        unauthorized(e.response?.status ?? 0, e.response?.data?.message ?? e.message);
      }
      console.log(e);
    }
  },
}));

export default CartStore;
