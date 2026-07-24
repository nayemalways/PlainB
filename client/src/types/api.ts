export interface ApiResponse<T> {
  success: boolean;
  statusCode?: number;
  message: string;
  data: T;
}

export interface ApiError {
  success?: false;
  statusCode?: number;
  message: string;
  errorSources?: Array<{ path: string; message: string }>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';
