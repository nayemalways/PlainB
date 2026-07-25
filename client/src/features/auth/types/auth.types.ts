import type { RequestStatus } from '../../../types/api.ts';

export interface SessionUser {
  userId: string;
  email: string;
  role: 'USER' | 'ADMIN';
  name: string;
  profilePhoto: string | null;
  canChangePassword: boolean;
  csrfToken: string | null;
}

export interface AuthState {
  user: SessionUser | null;
  initialized: boolean;
  status: RequestStatus;
  error: string | null;
  pendingEmail: string;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  registerAccount: (input: {
    name: string;
    email: string;
    password: string;
    file?: File;
  }) => Promise<void>;
  verifyEmail: (otp: string) => Promise<void>;
  logout: () => Promise<void>;
  clearSession: () => void;
}
