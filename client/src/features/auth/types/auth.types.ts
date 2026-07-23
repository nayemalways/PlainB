import type { RequestStatus } from '../../../types/api.ts';

export interface SessionUser {
  userId: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface AuthState {
  user: SessionUser | null;
  initialized: boolean;
  status: RequestStatus;
  error: string | null;
  pendingEmail: string;
  initialize: () => Promise<void>;
  requestOtp: (email: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  logout: () => Promise<void>;
  clearSession: () => void;
}
