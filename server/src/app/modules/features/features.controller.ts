import { FeaturesListService, LegalDetailsService } from './features.service.ts';
import { SendResponse } from '../../utility/SendResponse.ts';

// Features list
export const FeaturesList = async (req, res) => {
  const result = await FeaturesListService();
  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Features retrieved successfully',
    data: result,
  });
};

// Legal Details
export const LegalDetails = async (req, res) => {
  const result = await LegalDetailsService(req);
  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Legal details retrieved successfully',
    data: result,
  });
};
