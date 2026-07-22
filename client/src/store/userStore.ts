/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import Cookies from 'js-cookie';
import { create } from 'zustand';
import {
  BaseServerV2Url,
  getEmail,
  setEmail,
  unauthorized,
} from '../utility/utility.ts';
import toast from 'react-hot-toast';

interface UserAddress {
  cus_address: {
      cus_address: string,
      cus_city: string,
      cus_country: string,
      cus_fax: string,
      cus_name: string,
      cus_phone: string,
      cus_postcode: string,
      cus_state: string,
    },

    ship_address: {
      ship_address: string,
      ship_city: string,
      ship_country: string,
      ship_name: string,
      ship_phone: string,
      ship_postcode: string,
      ship_state: string,
    }
}

interface ProfileSaveResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: null;
}

interface UserState {
  LoginFormData: { email: string };
  inputOnchange: (name: 'email', value: string) => void;
  OTPFormData: { otp: string };
  OTPOnchange: (name: 'otp', value: string) => void;
  isLogin: () => boolean;
  logoutRequest: () => Promise<any>;
  isSubmitForm: boolean;
  userOtpRequest: (email: string) => Promise<any>;
  OtpVerifyRequest: (code: string) => Promise<any>;
  profileForm: UserAddress;
  profileFormOnChange: (name: string, value: string) => void;
  profileDetails: any;
  profileDetailsRequest: () => Promise<void>;
  profileSaveRequest: (payload: UserAddress) => Promise<ProfileSaveResponse | undefined>;
}

const UserStore = create<UserState>()((set) => ({
  // Login form state management
  LoginFormData: { email: '' },
  inputOnchange: (name, value) => {
    set((state) => ({
      LoginFormData: {
        ...state.LoginFormData,
        [name]: value,
      },
    }));
  },

  OTPFormData: { otp: '' },
  OTPOnchange: (name, value) => {
    set((state) => ({
      OTPFormData: {
        ...state.OTPFormData,
        [name]: value,
      },
    }));
  },

  /* --------API Call------- */
  // Is user logged in
  isLogin: () => {
    return !!Cookies.get('accessToken');
  },

  // User Logout
  logoutRequest: async () => {
    try {
      const config = {
        withCredentials: true,
        headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
      };
      const res = await axios.get(`${BaseServerV2Url}/auth/logout`, config); // Send request to server
      sessionStorage.clear();
      localStorage.clear();
      return res?.data;
    } catch (error) {
      toast.error('Something went wrong');
      console.error(error.toString());
    }
  },

  // Login Otp request
  isSubmitForm: false, // Form submit state
  userOtpRequest: async (email) => {
    set({ isSubmitForm: true });

    try {
      const res = await axios.post(`${BaseServerV2Url}/auth/login`, { email });
      setEmail(email); // Set user email inside sessionStorage
      return res.data;
    } catch (error) {
      toast.error('Something went wrong');
      console.error(error.toString());
    } finally {
      set({ isSubmitForm: false });
    }
  },

  OtpVerifyRequest: async (code) => {
    try {
      const email = getEmail(); // Get user email from sessionStorage
      set({ isSubmitForm: true });
      const res = await axios.post(
        `${BaseServerV2Url}/auth/verify`,
        { email, otp: Number(code) },
        { withCredentials: true },
      );
      set({ isSubmitForm: false });

      const data = res.data;

      return data;
    } catch (error) {
      toast.error('Something went wrong');
      console.error(error.toString());
    }
  },

  // User Profile
  profileForm: {
    cus_address: {
      cus_address: '',
      cus_city: '',
      cus_country: '',
      cus_fax: '',
      cus_name: '',
      cus_phone: '',
      cus_postcode: '',
      cus_state: '',
    },

    ship_address: {
      ship_address: '',
      ship_city: '',
      ship_country: '',
      ship_name: '',
      ship_phone: '',
      ship_postcode: '',
      ship_state: '',
    }
  },
  profileFormOnChange: (name, value) => {
    const addressType = name.startsWith('cus_') ? 'cus_address' : 'ship_address';
    set((state) => ({
      profileForm: {
        ...state.profileForm,
        [addressType]: {
          ...state.profileForm[addressType],
          [name]: value,
        },
      },
    }));
  },

  // Profile details
  profileDetails: null,
  profileDetailsRequest: async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` } };
      const res = await axios.get(`${BaseServerV2Url}/user`, config); // Api Call
      if (res['data'] || res['data']['data'].length > 0) {
        set({ profileDetails: res['data']['data'] });
        set({ profileForm: res['data']['data'] });
      } else {
        set({ profileDetails: [] });
      }
    } catch (error) {
      toast.error('Something went wrong');
      console.error(error.toString());
      unauthorized(error.response.status);
    }
  },

  profileSaveRequest: async (payload) => {
    try {
      console.log(payload);
      set({ profileDetails: null });
      const config = { headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` } };
      const res = await axios.post(`${BaseServerV2Url}/user`, payload, config);
      console.log(res.data)
      return res.data;
    } catch (error) {
      toast.error('Something went wrong');
      console.error(error.toString());
      unauthorized(error.response.status);
    }
  },
}));

export default UserStore;
