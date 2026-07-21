/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import Cookies from 'js-cookie';
import { create } from 'zustand';
import {
  BaseServerUrl,
  BaseServerV2Url,
  getEmail,
  setEmail,
  unauthorized,
} from '../utility/utility.ts';
import toast from 'react-hot-toast';

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
  profileForm: Record<string, string>;
  profileFormOnChange: (name: string, value: string) => void;
  profileDetails: any;
  profileDetailsRequest: () => Promise<void>;
  profileSaveRequest: (payload: Record<string, string>) => Promise<boolean | undefined>;
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
    try {
      set({ isSubmitForm: true });
      const res = await axios.post(`${BaseServerV2Url}/auth/login`, { email });
      set({ isSubmitForm: false });
      setEmail(email); // Set user email inside sessionStorage
      return res.data;
    } catch (error) {
      toast.error('Something went wrong');
      console.error(error.toString());
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
    userID: '',
    cus_address: '',
    cus_city: '',
    cus_country: '',
    cus_fax: '',
    cus_name: '',
    cus_phone: '',
    cus_postcode: '',
    cus_state: '',
    ship_address: '',
    ship_city: '',
    ship_country: '',
    ship_name: '',
    ship_phone: '',
    ship_postcode: '',
    ship_state: '',
  },
  profileFormOnChange: (name, value) => {
    set((state) => ({
      profileForm: {
        ...state.profileForm,
        [name]: value,
      },
    }));
  },

  // Profile details
  profileDetails: null,
  profileDetailsRequest: async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` } };
      const res = await axios.get(`${BaseServerUrl}/api/ReadProfile`, config); // Api Call
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
      set({ profileDetails: null });
      const config = { headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` } };
      const res = await axios.post(`${BaseServerUrl}/api/SaveProfile`, payload, config);
      return res.data['status'] === 'Success';
    } catch (error) {
      toast.error('Something went wrong');
      console.error(error.toString());
      unauthorized(error.response.status);
    }
  },
}));

export default UserStore;
