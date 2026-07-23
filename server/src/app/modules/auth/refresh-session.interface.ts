import type { Types } from 'mongoose';

export interface IRefreshSession {
  userId: Types.ObjectId;
  jti: string;
  familyId: string;
  tokenHash: string;
  expiresAt: Date;
  revokedAt?: Date;
  rotatedTo?: string;
  reuseDetectedAt?: Date;
}
