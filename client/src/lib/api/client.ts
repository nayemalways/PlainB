import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from '../../types/api.ts';

const baseURL = import.meta.env.VITE_BASE_V2_URL as string;

let csrfToken: string | null = null;

export const setCsrfToken = (token?: string | null) => {
  csrfToken = token || null;
};

export const clearCsrfToken = () => {
  csrfToken = null;
};

export const syncCsrfToken = async () => {
  const response = await axios.get<{ data: { csrfToken: string | null } }>(
    `${baseURL}/auth/csrf-token`,
    { withCredentials: true },
  );
  setCsrfToken(response.data.data.csrfToken);
};

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { Accept: 'application/json' },
});

let refreshPromise: Promise<void> | null = null;
let authFailureHandler: (() => void) | undefined;

export const setAuthFailureHandler = (handler: () => void) => {
  authFailureHandler = handler;
};

const addCsrfHeader = (config: InternalAxiosRequestConfig) => {
  const method = config.method?.toUpperCase();
  if (method && !['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    if (csrfToken) config.headers.set('X-CSRF-Token', csrfToken);
  }
  return config;
};

api.interceptors.request.use(addCsrfHeader);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const request = error.config as (InternalAxiosRequestConfig & { _retried?: boolean }) | undefined;
    const refreshExcluded = [
      '/auth/login',
      '/auth/refresh',
      '/auth/logout',
      '/user/register',
      '/user/verify-email',
    ].some(
      (path) => request?.url?.includes(path),
    );
    if (error.response?.status !== 401 || !request || request._retried || refreshExcluded) {
      return Promise.reject(error);
    }

    request._retried = true;
    refreshPromise ??= (async () => {
      if (!csrfToken) await syncCsrfToken();
      const response = await axios.post<{ data: { csrfToken: string } }>(
        `${baseURL}/auth/refresh`,
        undefined,
        {
        withCredentials: true,
          headers: csrfToken ? { 'X-CSRF-Token': csrfToken } : undefined,
        },
      );
      setCsrfToken(response.data.data.csrfToken);
    })()
      .finally(() => {
        refreshPromise = null;
      });

    try {
      await refreshPromise;
      return api(request);
    } catch {
      authFailureHandler?.();
      return Promise.reject(error);
    }
  },
);
