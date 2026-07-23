import { create } from 'zustand';
import axios from 'axios';
import { BaseServerV2Url, unauthorized } from '../utility/utility.ts';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

interface WishResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: unknown;
}

interface WishState {
  isWishSubmit: boolean;
  saveToWishlist: (productID: string) => Promise<WishResponse | undefined>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  WishList: any[] | null;
  WishCount: number;
  WishListRequest: () => Promise<void>;
  totalWishCount: () => Promise<number | undefined>;
  removeFromWish: (productID: string) => Promise<WishResponse | undefined>;
}

const wishStore = create<WishState>()((set) => ({
  isWishSubmit: false,
  // Add to Cart Request
  saveToWishlist: async (productId: string) => {
    try {
      set({ isWishSubmit: true });
      const config = { headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` } };
      const res = await axios.post<WishResponse>(
        `${BaseServerV2Url}/wishlist`,
        { productId },
        config,
      ); // Api call
      
      if (res.data?.success) {
        return res.data;
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        unauthorized(e.response?.status ?? 0, e.response?.data?.message ?? e.message);
        toast.error(e.response?.data?.message)
      }
      console.log(e);
    } finally {
      set({ isWishSubmit: false });
    }
  },

  WishList: null,
  WishListRequest: async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` } };
      const res = await axios.get(`${BaseServerV2Url}/wishlist`, config);
      
      set({ WishList: res.data['data'] });
      return;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        unauthorized(e.response?.status ?? 0, e.response?.data?.message ?? e.message);
      }
      console.log(e);
    }
  },
  
  WishCount: 0,
  totalWishCount: async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` } };
      const res = await axios.get<{ data: number }>(
        `${BaseServerV2Url}/wishlist/total`,
        config,
      );
      set({ WishCount: res.data.data });
      return res.data.data;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        unauthorized(e.response?.status ?? 0, e.response?.data?.message ?? e.message);
      }
      console.log(e);
    }
  },

  removeFromWish: async (productId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` } };
      const res = await axios.delete(`${BaseServerV2Url}/wishlist/${productId}`, config);
      return res.data;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        unauthorized(e.response?.status ?? 0, e.response?.data?.message ?? e.message);
      }
      console.log(e);
    }
  },
}));

export default wishStore;
