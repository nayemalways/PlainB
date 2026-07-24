import { create } from 'zustand';
import { api, setAuthFailureHandler } from '../../../lib/api/client.ts';
import { getErrorMessage } from '../../../lib/utils/format.ts';
import type { ApiResponse } from '../../../types/api.ts';
import type { AuthState, SessionUser } from '../types/auth.types.ts';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  initialized: false,
  status: 'idle',
  error: null,
  pendingEmail: sessionStorage.getItem('plainb-login-email') ?? '',

  clearSession: () => set({ user: null, status: 'error' }),

  initialize: async () => {
    if (get().status === 'loading') return;
    set({ status: 'loading', error: null });
    try {
      const { data } = await api.get<ApiResponse<SessionUser>>('/auth/session');
      set({ user: data.data, status: 'success', initialized: true });
    } catch {
      set({ user: null, status: 'error', initialized: true });
    }
  },

  requestOtp: async (email) => {
    set({ status: 'loading', error: null });
    try {
      await api.post('/auth/login', { email });
      sessionStorage.setItem('plainb-login-email', email);
      set({ pendingEmail: email, status: 'success' });
    } catch (error) {
      const message = getErrorMessage(error, 'Unable to send the login code.');
      set({ status: 'error', error: message });
      throw error;
    }
  },

  verifyOtp: async (otp) => {
    const email = get().pendingEmail;
    set({ status: 'loading', error: null });
    try {
      await api.post('/auth/verify', { email, otp: Number(otp) });
      sessionStorage.removeItem('plainb-login-email');
      const { data } = await api.get<ApiResponse<SessionUser>>('/auth/session');
      set({ user: data.data, pendingEmail: '', status: 'success' });
    } catch (error) {
      const message = getErrorMessage(error, 'The verification code is not valid.');
      set({ status: 'error', error: message });
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      sessionStorage.removeItem('plainb-login-email');
      set({ user: null, status: 'error', pendingEmail: '' });
    }
  },
}));

setAuthFailureHandler(() => useAuthStore.getState().clearSession());
