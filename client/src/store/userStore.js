import axios from 'axios';
import Cookies from 'js-cookie';
import { create } from 'zustand';
import { getEmail, setEmail, unauthorized } from '../utility/utility';
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
    },

    // User Profile
    profileForm: {
        userID: "",
        cus_address: "",
        cus_city:  "",
        cus_country:  "",
        cus_fax:  "",
        cus_name:  "",
        cus_phone:  "",
        cus_postcode:  "",
        cus_state:  "",
        ship_address:  "",
        ship_city:  "",
        ship_country:  "",
        ship_name:  "",
        ship_phone:  "",
        ship_postcode:  "",
        ship_state:  ""
    },
    profileFormOnChange: (name, value) => {
        set(state => ({
            profileForm: {
                ...state.profileForm,
                [name] : value
            }
        }))
    },

    // Profile detals
    profileDetails: null,
    profileDetailsRequest: async () => {
        try {
            let config = { headers: { token: Cookies.get('token')}}; // Access refresh token
            let res = await axios.get(`/api/ReadProfile`, config); // Api Call
            if(res['data'] || res['data']['data'].length > 0) {
                set( {profileDetails: res['data']['data']});
                set( {profileForm: res['data']['data']});
            }else {
                set( {profileDetails: []} );
            }
         }catch(error) {
            toast.error( "Something went wrong");
            console.error( error.toString() );
            unauthorized(error.response.status);
        }
    },

    profileSaveRequest: async (postbody) => {
        try {
            set( {profileDetails: null});
            let config = { headers: { token: Cookies.get('token')}}; // Access refresh token
            let res = await axios.post(`api/SaveProfile`, postbody, config);
            return res.data['status'] === "Success";
        }catch(error) {
            toast.error( "Something went wrong");
            console.error( error.toString() );
            unauthorized(error.response.status);
        }
    }
}))




export default UserStore;