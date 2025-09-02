import { create } from 'zustand';
import axios from 'axios';
import { BaseServerUrl } from '../utility/utility';

const FeaturesStore = create((set) => ({
    FeaturesList: null,
    FeaturesListRequest: async () => {
        try {
            set( {FeaturesList: null });
            let res = await axios.get(`${BaseServerUrl}/api/FeaturesList`);
            if(res?.data?.status === 'Success') {
                set( {FeaturesList: res?.data['data']});
            }
        }catch(error) {
            console.error('Error fetching features:', error);
        }
    }
}))




export default FeaturesStore;