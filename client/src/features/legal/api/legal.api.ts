import { api } from '../../../lib/api/client.ts';
import type { ApiResponse } from '../../../types/api.ts';

export interface LegalDocument { _id: string; type: string; description: string }
export const getLegalDocuments = async (type: string) =>
  (await api.get<ApiResponse<LegalDocument[]>>(`/features/legalDetails/${type}`)).data.data;
