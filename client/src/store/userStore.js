import { create } from 'zustand';
import axios from 'axios';
import { getEmail, setEmail } from '../utility/utility';

const UserStore = create((set) => ({
    
    userOtpRequest: async (email) => {
        try {
            let res = await axios.get(`/api/UserOTP/${email}`);
            setEmail(email) // Set user email inside sessionStorage
            return res?.data?.status === 'Success';
        }catch(error) {
            console.error('Error fetching login credentials:', error);
        }
    },

    OtpVerifyRequest: async (code) => {
        try {
            const email = getEmail(); // Get user email from sessionStorage
            let res = await axios.get(`/api/OTPVerifyLogin/${email}/${code}`);
            return res?.data?.status === 'Success';
        }catch(error) {
            console.error('Error fetching login credentials:', error);
        }
    }
}))




export default UserStore;