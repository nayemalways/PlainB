import { create } from 'zustand';
import { api } from '../../../lib/api/client.ts';
import { getErrorMessage } from '../../../lib/utils/format.ts';
import type { ApiResponse, RequestStatus } from '../../../types/api.ts';
import type { UserProfile } from '../types/profile.types.ts';

interface ProfileState {
  profile: UserProfile | null;
  status: RequestStatus;
  error: string | null;
  load: () => Promise<void>;
  save: (profile: UserProfile) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  status: 'idle',
  error: null,
  load: async () => {
    set({ status: 'loading', error: null });
    try {
      const { data } = await api.get<ApiResponse<UserProfile>>('/user');
      set({ profile: data.data, status: 'success' });
    } catch (error) {
      set({ status: 'error', error: getErrorMessage(error) });
    }
  },
  save: async (profile) => {
    set({ status: 'loading', error: null });
    try {
      await api.post('/user', profile);
      set({ profile, status: 'success' });
    } catch (error) {
      set({ status: 'error', error: getErrorMessage(error) });
      throw error;
    }
  },
}));
