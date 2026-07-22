/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import axios from 'axios';
import { BaseServerV2Url } from '../utility/utility.ts';

interface FeaturesState {
  isFeaturesLoading: boolean;
  FeaturesList: any[] | null;
  FeaturesListRequest: () => Promise<void>;
  legalList: any[] | null;
  LegalRequest: (type: string) => Promise<void>;
}

const FeaturesStore = create<FeaturesState>()((set) => ({
  isFeaturesLoading: false,
  FeaturesList: null,
  FeaturesListRequest: async () => {
    set({ isFeaturesLoading: true });

    try {
      const res = await axios.get(`${BaseServerV2Url}/features`);
      const result = res.data.success ? res.data.data : res.data;
      if (result.status) {
        set({ FeaturesList: result.data });
      } else {
        set({ FeaturesList: [] });
      }
    } catch (error) {
      set({ FeaturesList: [] });
      console.error('Error fetching features:', error);
    } finally {
      set({ isFeaturesLoading: false });
    }
  },

  legalList: null,
  LegalRequest: async (type) => {
    try {
      set({ legalList: null });
      const res = await axios.get(`${BaseServerV2Url}/api/legalDetails/${type}`);
      if (res?.data?.status === 'Success') {
        set({ legalList: res?.data?.data });
      }
    } catch (error) {
      console.error('Error fetching Legal Statements:', error);
    }
  },
}));

export default FeaturesStore;
