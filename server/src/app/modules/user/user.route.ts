import express from 'express';
 import { userControllers } from './user.controller.ts';
import { Role } from './user.interface.ts';
import { checkAuth } from '../../middlewares/AuthMiddleware.ts';
import { validateRequest } from '../../middlewares/validateRequest.ts';
import { userValidation } from './user.validation.ts';
import {
  cleanupCloudinaryUploadsOnError,
  userImageUpload,
} from '../../config/multer.config.ts';

const router = express.Router();

router.post(
  '/register',
  userImageUpload.single('file'),
  validateRequest(userValidation.createUserSchema),
  userControllers.registerUser,
  cleanupCloudinaryUploadsOnError,
);
router.post(
  '/verify-email',
  validateRequest(userValidation.verifyEmailSchema),
  userControllers.verifyEmail,
);
router.post('/', checkAuth(Role.USER), userControllers.saveProfile);
router.get('/', checkAuth(Role.USER), userControllers.readProfile);

export const userRouter = router;
