import { create } from 'zustand';
import { api } from '../../../lib/api/client.ts';
import type { ApiResponse, RequestStatus } from '../../../types/api.ts';

export interface Review {
  _id: string;
  des: string;
  rating: string;
  profile: { cus_name: string };
}
interface ReviewState {
  reviews: Review[];
  status: RequestStatus;
  load: (productId: string) => Promise<void>;
}

export const useReviewStore = create<ReviewState>((set) => ({
  reviews: [],
  status: 'idle',
  load: async (productId) => {
    set({ status: 'loading' });
    try {
      const { data } = await api.get<ApiResponse<Review[]>>(`/review/${productId}`);
      set({ reviews: data.data, status: 'success' });
    } catch {
      set({ reviews: [], status: 'error' });
    }
  },
}));
