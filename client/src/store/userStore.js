import axios from 'axios';
import Cookies from 'js-cookie';
import { create } from 'zustand';
import { getEmail, setEmail } from '../utility/utility';
import toast from 'react-hot-toast';

 
const UserStore = create((set) => ({
    // Login form state management
    LoginFormData: {email: ""},
    inputOnchange: (name, value) => {
         set(state => ({
            LoginFormData: {
                ...state.LoginFormData,
                [name]: value
            }
         }))
    },

    OTPFormData: {otp: ""},
    OTPOnchange: (name, value) => {
         set(state => ({
            OTPFormData: {
                ...state.OTPFormData,
                [name]: value
            }
         }))
    },


    /* --------API Call------- */
    // Is user logged in
    isLogin: () => {
       return !!Cookies.get('token');
    },

    // User Logout
    logoutRequest: async ( ) => {
        try {
            let config = { headers: { token: Cookies.get('token')}}; // Access refresh token
            let res = await axios.get(`/api/UserLogout`, config); // Send request to server
            sessionStorage.clear();
            localStorage.clear();
            return res?.data?.status === 'Success';
        }catch(error) {
            toast.error( "Something went wrong");
            console.error( error.toString() );
        }
    },


    // Login Otp request
    isSubmitForm: false, // Form submit state
    userOtpRequest: async (email) => {
        try {
            set( { isSubmitForm: true });
            let res = await axios.get(`/api/UserOTP/${email}`);
            set({ isSubmitForm: false });
            setEmail(email) // Set user email inside sessionStorage
            return res?.data?.status === 'Success';
        }catch(error) {
            toast.error( "Something went wrong");
            console.error( error.toString() );
        }
    },

    OtpVerifyRequest: async (code) => {
        try {
            const email = getEmail(); // Get user email from sessionStorage
            set( {isSubmitForm: true });
            let res = await axios.get(`/api/OTPVerifyLogin/${email}/${code}`);
            set( {isSubmitForm: false });
            return res?.data?.status === 'Success';
        }catch(error) {
            toast.error( "Something went wrong");
            console.error( error.toString() );
        }
    }
}))




export default UserStore;