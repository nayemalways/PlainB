import { create } from 'zustand';
import axios from 'axios';
import { BaseServerUrl } from '../utility/utility.ts';

interface FeaturesState {
  FeaturesList: any[] | null;
  FeaturesListRequest: () => Promise<void>;
  legalList: any[] | null;
  LegalRequest: (type: string) => Promise<void>;
}

const FeaturesStore = create<FeaturesState>()((set) => ({
  FeaturesList: null,
  FeaturesListRequest: async () => {
    try {
      set({ FeaturesList: null });
      const res = await axios.get(`${BaseServerUrl}/api/FeaturesList`);
      if (res?.data?.status === 'Success') {
        set({ FeaturesList: res?.data['data'] });
      }
    } catch (error) {
      console.error('Error fetching features:', error);
    }
  },

  legalList: null,
  LegalRequest: async (type) => {
    try {
      set({ legalList: null });
      const res = await axios.get(`${BaseServerUrl}/api/legalDetails/${type}`);
      if (res?.data?.status === 'Success') {
        set({ legalList: res?.data?.data });
      }
    } catch (error) {
      console.error('Error fetching Legal Statements:', error);
    }
  },
}));

export default FeaturesStore;
