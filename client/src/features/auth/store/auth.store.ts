import { create } from 'zustand';
import {
  api,
  clearCsrfToken,
  setAuthFailureHandler,
  setCsrfToken,
  syncCsrfToken,
} from '../../../lib/api/client.ts';
import { getErrorMessage } from '../../../lib/utils/format.ts';
import type { ApiResponse } from '../../../types/api.ts';
import type { AuthState, SessionUser } from '../types/auth.types.ts';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  initialized: false,
  status: 'idle',
  error: null,
  pendingEmail: sessionStorage.getItem('plainb-verification-email') ?? '',

  clearSession: () => {
    clearCsrfToken();
    set({ user: null, status: 'error' });
  },

  initialize: async () => {
    if (get().status === 'loading') return;
    set({ status: 'loading', error: null });
    try {
      await syncCsrfToken();
      const { data } = await api.get<ApiResponse<SessionUser>>('/auth/session');
      setCsrfToken(data.data.csrfToken);
      set({ user: data.data, status: 'success', initialized: true });
    } catch {
      set({ user: null, status: 'error', initialized: true });
    }
  },

  login: async (email, password) => {
    set({ status: 'loading', error: null });
    try {
      const loginResponse = await api.post<ApiResponse<{ csrfToken: string }>>(
        '/auth/login',
        { email, password },
      );
      setCsrfToken(loginResponse.data.data.csrfToken);
      const { data } = await api.get<ApiResponse<SessionUser>>('/auth/session');
      set({ user: data.data, status: 'success' });
    } catch (error) {
      const message = getErrorMessage(error, 'Unable to sign in.');
      set({ status: 'error', error: message });
      throw error;
    }
  },

  registerAccount: async ({ name, email, password, file }) => {
    set({ status: 'loading', error: null });
    try {
      const body = new FormData();
      body.set('name', name);
      body.set('email', email);
      body.set('password', password);
      if (file) body.set('file', file);
      await api.post('/user/register', body);
      sessionStorage.setItem('plainb-verification-email', email);
      set({ pendingEmail: email, status: 'success' });
    } catch (error) {
      const message = getErrorMessage(error, 'Unable to create the account.');
      set({ status: 'error', error: message });
      throw error;
    }
  },

  verifyEmail: async (otp) => {
    const email = get().pendingEmail;
    set({ status: 'loading', error: null });
    try {
      const verification = await api.post<ApiResponse<{ csrfToken: string }>>(
        '/user/verify-email',
        { email, otp },
      );
      setCsrfToken(verification.data.data.csrfToken);
      sessionStorage.removeItem('plainb-verification-email');
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
      clearCsrfToken();
      sessionStorage.removeItem('plainb-verification-email');
      set({ user: null, status: 'error', pendingEmail: '' });
    }
  },
}));

setAuthFailureHandler(() => useAuthStore.getState().clearSession());
