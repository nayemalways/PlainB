import mongoose from 'mongoose';
import type { IRefreshSession } from './refresh-session.interface.ts';

const refreshSessionSchema = new mongoose.Schema<IRefreshSession>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    jti: { type: String, required: true, unique: true },
    familyId: { type: String, required: true, index: true },
    tokenHash: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
    revokedAt: Date,
    rotatedTo: String,
    reuseDetectedAt: Date,
  },
  { timestamps: true, versionKey: false },
);

const RefreshSession = mongoose.model<IRefreshSession>(
  'refresh_sessions',
  refreshSessionSchema,
);

export default RefreshSession;
