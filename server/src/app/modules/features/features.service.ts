import FeaturesModel from './features.model.ts';
import LegalModel from './legal-details.model.ts';
import type { IFeature } from './features.interface.ts';
import AppError from '../../errorHelpers/appError.ts';
import { StatusCodes } from 'http-status-codes';

// GET FEATURES
const featuresListService = async () => await FeaturesModel.find();

// CREATE FEATURE
const createFeatureService = async (payload: IFeature) => {
  const existingFeature = await FeaturesModel.exists({ name: payload.name });

  if (existingFeature) {
    throw new AppError(StatusCodes.CONFLICT, 'Feature already exists');
  }

  return FeaturesModel.create(payload);
};

// LEGAL DETAILS
const legalDetailsService = async (req) => {
  const type = req.params.type;
  const data = await LegalModel.find({ type: type });
  return data;
};

export const featuresService = {
  featuresListService,
  createFeatureService,
  legalDetailsService,
};
