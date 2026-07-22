import express from 'express';
import { checkAuth } from '../../middlewares/AuthMiddleware.ts';
import { validateRequest } from '../../middlewares/validateRequest.ts';
import { Role } from '../user/user.interface.ts';
import { categoryControllers } from './category.controller.ts';
import { categoryValidation } from './category.validation.ts';
import {
  categoryImageUpload,
  cleanupCloudinaryUploadsOnError,
} from '../../config/multer.config.ts';

const router = express.Router();

router.get('/', categoryControllers.getCategoryList);
router.post(
  '/',
  checkAuth(Role.ADMIN),
  categoryImageUpload.single('file'),
  validateRequest(categoryValidation.createCategorySchema),
  categoryControllers.createCategory,
  cleanupCloudinaryUploadsOnError,
);

export const categoryRouter = router;
