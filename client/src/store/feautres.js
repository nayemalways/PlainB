import { create } from 'zustand';
import axios from 'axios';

const FeaturesStore = create((set) => ({
    FeaturesList: null,
    FeaturesListRequest: async () => {
        let res = await axios.get('/api/FeaturesList');
        if(res.status === 'success') {
            set({FeaturesStore: res.data['data']});
        }
    }
}))


export default FeaturesStore;