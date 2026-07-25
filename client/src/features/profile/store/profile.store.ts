import { create } from 'zustand';
import { api } from '../../../lib/api/client.ts';
import { getErrorMessage } from '../../../lib/utils/format.ts';
import type { ApiResponse, RequestStatus } from '../../../types/api.ts';
import type { UserProfile } from '../types/profile.types.ts';
import { setCsrfToken } from '../../../lib/api/client.ts';
import { useAuthStore } from '../../auth/store/auth.store.ts';

interface ProfileState {
  profile: UserProfile | null;
  status: RequestStatus;
  error: string | null;
  load: () => Promise<void>;
  save: (profile: UserProfile, file?: File) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  reset: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  status: 'idle',
  error: null,
  load: async () => {
    set({ status: 'loading', error: null });
    try {
      const { data } = await api.get<ApiResponse<UserProfile>>('/user/profile');
      set({ profile: data.data, status: 'success' });
    } catch (error) {
      set({ status: 'error', error: getErrorMessage(error) });
    }
  },
  save: async (profile, file) => {
    set({ status: 'loading', error: null });
    try {
      const payload = {
        cus_address: profile.cus_address,
        ship_address: profile.ship_address,
      };
      const body: FormData | typeof payload = file
        ? (() => {
            const formData = new FormData();
            formData.set('data', JSON.stringify(payload));
            formData.set('file', file);
            return formData;
          })()
        : payload;
      const { data } = await api.patch<ApiResponse<UserProfile>>('/user/profile', body);
      set({ profile: data.data, status: 'success' });
      useAuthStore.setState((state) => ({
        user: state.user
          ? {
              ...state.user,
              name: data.data.cus_address?.cus_name ?? '',
              profilePhoto: data.data.profilePhoto,
            }
          : null,
      }));
    } catch (error) {
      set({ status: 'error', error: getErrorMessage(error) });
      throw error;
    }
  },
  changePassword: async (currentPassword, newPassword) => {
    set({ status: 'loading', error: null });
    try {
      const { data } = await api.post<ApiResponse<{ csrfToken: string }>>(
        '/user/change-password',
        { currentPassword, newPassword },
      );
      setCsrfToken(data.data.csrfToken);
      set({ status: 'success' });
    } catch (error) {
      set({ status: 'error', error: getErrorMessage(error) });
      throw error;
    }
  },
  reset: () => set({ profile: null, status: 'idle', error: null }),
}));
