import mongoose from 'mongoose';
import type { ILegalDetails } from './features.interface.ts';

const DataSchema = new mongoose.Schema<ILegalDetails>({
  description: { type: String },
  type: { type: String },
});

const LegalModel = mongoose.model<ILegalDetails>('legals', DataSchema);
export default LegalModel;
