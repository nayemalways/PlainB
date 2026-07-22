import { create } from 'zustand';
import axios from 'axios';
import { BaseServerV2Url, unauthorized } from '../utility/utility.ts';
import Cookies from 'js-cookie';

interface WishResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: unknown;
}

interface WishState {
  isWishSubmit: boolean;
  SaveWishRequest: (productID: string) => Promise<boolean | string | undefined>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  WishList: any[] | null;
  WishCount: number;
  WishListRequest: () => Promise<void>;
  removeFromWish: (productID: string) => Promise<WishResponse | undefined>;
}

const wishStore = create<WishState>()((set) => ({
  isWishSubmit: false,
  // Add to Cart Request
  SaveWishRequest: async (productID) => {
    try {
      set({ isWishSubmit: true });
      const config = { headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` } };
      const res = await axios.post(`${BaseServerV2Url}/wishlist`, { productID }, config); // Api call
      return res.data['status'] === 'Success' ? true : res.data['message'];
    } catch (e) {
      // unauthorized(e.response.status);
      console.log(e.toString());
    } finally {
      set({ isWishSubmit: false });
    }
  },

  WishList: null,
  WishCount: 0,
  WishListRequest: async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` } };
      const res = await axios.get(`${BaseServerV2Url}/wishlist`, config);

      set({ WishList: res.data['data'] });
      set({ WishCount: res.data['data'].length });
      return;
    } catch (e) {
      unauthorized(e.message);
      console.log(e.message);
    }
  },

  removeFromWish: async (productID) => {
    try {
      const config = { headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` } };
      const postBody = { productID };
      const res = await axios.post(`${BaseServerV2Url}/wishlist`, postBody, config);
      return res.data;
    } catch (e) {
      unauthorized(e.response.status);
      console.log(e.toString());
    }
  },
}));

export default wishStore;
