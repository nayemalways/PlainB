import { create } from 'zustand';
import axios from 'axios';
import API from '../utility/instance.js';

const FeaturesStore = create((set) => ({
    FeaturesList: null,
    FeaturesListRequest: async () => {
        let res = await API.get('/FeaturesList');
        if(res.status === 'success') {
            set({FeaturesStore: res.data['data']});
        }
    }
}))


export default FeaturesStore;