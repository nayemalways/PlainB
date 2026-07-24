import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from '../../types/api.ts';

const baseURL = import.meta.env.VITE_BASE_V2_URL as string;

const readCookie = (name: string) =>
  document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${name}=`))
    ?.split('=')
    .slice(1)
    .join('=');

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
    const token = readCookie('csrfToken');
    if (token) config.headers.set('X-CSRF-Token', decodeURIComponent(token));
  }
  return config;
};

api.interceptors.request.use(addCsrfHeader);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const request = error.config as (InternalAxiosRequestConfig & { _retried?: boolean }) | undefined;
    const refreshExcluded = ['/auth/login', '/auth/verify', '/auth/refresh', '/auth/logout'].some(
      (path) => request?.url?.includes(path),
    );
    if (error.response?.status !== 401 || !request || request._retried || refreshExcluded) {
      return Promise.reject(error);
    }

    request._retried = true;
    refreshPromise ??= axios
      .post(`${baseURL}/auth/refresh`, undefined, {
        withCredentials: true,
        headers: { 'X-CSRF-Token': decodeURIComponent(readCookie('csrfToken') ?? '') },
      })
      .then(() => undefined)
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
