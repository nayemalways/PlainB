import { create } from 'zustand';
import axios from 'axios';

const FeaturesStore = create((set) => ({
    FeaturesList: null,
    FeaturesListRequest: async () => {
        let res = await axios.get('/api/FeaturesList');
        if(res?.data?.status === 'Success') {
            set({FeaturesList: res?.data['data']});
        }
    }
}))


async function api() {
    const res = await axios.get("http://localhost:5000/api/FeaturesList");
    console.log(res.data.data);
}
// api()

export default FeaturesStore;