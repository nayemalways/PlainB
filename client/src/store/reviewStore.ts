import axios from 'axios';
import Cookies from 'js-cookie';
import { create } from 'zustand';
import type {
  ICreateReview,
  IReview,
  IReviewApiResponse,
} from '../interfaces/review.interface.ts';
import { BaseServerV2Url, unauthorized } from '../utility/utility.ts';

interface ReviewState {
  reviewList: IReview[] | null;
  isReviewLoading: boolean;
  reviewListRequest: (productId: string) => Promise<void>;
  createReviewRequest: (payload: ICreateReview) => Promise<IReview | undefined>;
}

const ReviewStore = create<ReviewState>()((set) => ({
  reviewList: null,
  isReviewLoading: false,

  reviewListRequest: async (productId) => {
    set({ reviewList: null, isReviewLoading: true });

    try {
      const response = await axios.get<IReviewApiResponse<IReview[]>>(
        `${BaseServerV2Url}/review/${productId}`,
      );
      set({ reviewList: response.data.success ? response.data.data : [] });
    } catch (error) {
      set({ reviewList: [] });
      console.error('Error fetching review list:', error);
    } finally {
      set({ isReviewLoading: false });
    }
  },

  createReviewRequest: async (payload) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
      };
      const response = await axios.post<IReviewApiResponse<IReview>>(
        `${BaseServerV2Url}/review`,
        payload,
        config,
      );

      if (response.data.success) {
        return response.data.data;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        unauthorized(
          error.response?.status ?? 0,
          error.response?.data?.message ?? error.message,
        );
      }
      throw error;
    }
  },
}));

export default ReviewStore;
