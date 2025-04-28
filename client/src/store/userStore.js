import axios from 'axios';
import { create } from 'zustand';
import { getEmail, setEmail } from '../utility/utility';

const UserStore = create((set) => ({

    LoginFormData: {email: "ddd"},
    inputOnchange: (name, value) => {
        set((LoginFormData) => ({
            ...LoginFormData,
            [name]: value
        }))
    },


    isSubmitForm: false, // Form submit state
    userOtpRequest: async (email) => {
        try {
            set( {isSubmitForm: true });
            let res = await axios.get(`/api/UserOTP/${email}`);
            set( {isSubmitForm: false });
            setEmail(email) // Set user email inside sessionStorage
            return res?.data?.status === 'Success';
        }catch(error) {
            console.error('Error fetching login credentials:', error);
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
            console.error('Error fetching login credentials:', error);
        }
    }
}))




export default UserStore;