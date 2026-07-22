import mongoose from 'mongoose';
import type { IFeature } from './features.interface.ts';

const DataSchema = new mongoose.Schema<IFeature>(
  {
    name: { type: String, required: true, unique: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, trim: true, maxlength: 500 },
    img: { type: String, required: true },
  },
  { timestamps: true, versionKey: false },
);

const FeaturesModel = mongoose.model<IFeature>('features', DataSchema);

// Export Data Model
export default FeaturesModel;
