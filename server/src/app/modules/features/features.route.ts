import express from 'express';
import { checkAuth } from '../../middlewares/AuthMiddleware.ts';
import { Role } from '../user/user.interface.ts';
import { validateRequest } from '../../middlewares/validateRequest.ts';
import { featuresValidation } from './features.validation.ts';
import { cleanupCloudinaryUploadsOnError, featureImageUpload } from '../../config/multer.config.ts';
import { featuresControllers } from './features.controller.ts';

const router = express.Router();

router.get('/', featuresControllers.featuresList);
router.post(
  '/',
  checkAuth(Role.ADMIN),
  featureImageUpload.single('file'),
  validateRequest(featuresValidation.createFeatureSchema),
  featuresControllers.createFeature,
  cleanupCloudinaryUploadsOnError,
);
router.get('/legalDetails/:type',featuresControllers.legalDetails);

export const featuresRouter = router;
