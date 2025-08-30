import { create } from 'zustand';
import axios from 'axios';

const FeaturesStore = create((set) => ({
    FeaturesList: null,
    FeaturesListRequest: async () => {
        try {
            set( {FeaturesList: null });
            let res = await axios.get('https://plainb.onrender.com/api/FeaturesList');
            if(res?.data?.status === 'Success') {
                set( {FeaturesList: res?.data['data']});
            }
        }catch(error) {
            console.error('Error fetching features:', error);
        }
    },

     legalList:  null,
        LegalRequest: async (type) => {
            try {
                set({ legalList: null });
                const res = await axios.get(`https://plainb.onrender.com/api/legalDetails/${type}`);
                if (res?.data?.status === 'Success') {
                    set({ legalList: res?.data?.data });
                }
            } catch (error) {
                console.error('Error fetching Legal Statements:', error);
            }
        },
}))




export default FeaturesStore;