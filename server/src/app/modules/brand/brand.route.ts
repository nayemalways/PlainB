import express from 'express';
import { brandControllers } from './brand.controller.ts';
import { checkAuth } from '../../middlewares/AuthMiddleware.ts';
import { Role } from '../user/user.interface.ts';
import { validateRequest } from '../../middlewares/validateRequest.ts';
import { brandValidation } from './brand.validation.ts';
import { brandImageUpload, cleanupCloudinaryUploadsOnError } from '../../config/multer.config.ts';

const router = express.Router();

router.get('/', brandControllers.getBrandList);
router.post(
  '/',
  checkAuth(Role.ADMIN),
  brandImageUpload.single('file'),
  validateRequest(brandValidation.createBrandSchema),
  brandControllers.createBrand,
  cleanupCloudinaryUploadsOnError,
);

export const brandRouter = router;
