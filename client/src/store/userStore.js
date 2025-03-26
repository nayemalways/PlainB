import { create } from 'zustand';
import axios from 'axios';

const UserStore = create((set) => ({
    refreshToken: null,
    userRequest: async (email) => {
        try {
            set( {refreshToken: null });
            let res = await axios.get(`/api/UserOTP/${email}`);
            if(res?.data?.status === 'Success') {
                set( {refreshToken: res?.data['data']['token']});
            }
        }catch(error) {
            console.error('Error fetching login credentials:', error);
        }
    }
}))




export default UserStore;