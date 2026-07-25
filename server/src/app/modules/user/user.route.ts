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
const legacyRouter = express.Router();

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
router.get('/profile', checkAuth(Role.USER, Role.ADMIN), userControllers.readProfile);
router.patch(
  '/profile',
  checkAuth(Role.USER, Role.ADMIN),
  userImageUpload.single('file'),
  validateRequest(userValidation.updateProfileSchema),
  userControllers.saveProfile,
  cleanupCloudinaryUploadsOnError,
);
router.post(
  '/change-password',
  checkAuth(Role.USER, Role.ADMIN),
  validateRequest(userValidation.changePasswordSchema),
  userControllers.changePassword,
);

// Temporary profile aliases for existing clients.
router.post(
  '/',
  checkAuth(Role.USER, Role.ADMIN),
  userImageUpload.single('file'),
  validateRequest(userValidation.updateProfileSchema),
  userControllers.saveProfile,
  cleanupCloudinaryUploadsOnError,
);
router.get('/', checkAuth(Role.USER, Role.ADMIN), userControllers.readProfile);

export const userRouter = router;

// Preserve only the original unprefixed user endpoints. Keeping these on a
// separate router prevents newer endpoints such as /change-password from also
// being exposed without the /user prefix.
legacyRouter.post(
  '/register',
  userImageUpload.single('file'),
  validateRequest(userValidation.createUserSchema),
  userControllers.registerUser,
  cleanupCloudinaryUploadsOnError,
);
legacyRouter.post(
  '/verify-email',
  validateRequest(userValidation.verifyEmailSchema),
  userControllers.verifyEmail,
);
legacyRouter.post(
  '/',
  checkAuth(Role.USER, Role.ADMIN),
  userImageUpload.single('file'),
  validateRequest(userValidation.updateProfileSchema),
  userControllers.saveProfile,
  cleanupCloudinaryUploadsOnError,
);
legacyRouter.get('/', checkAuth(Role.USER, Role.ADMIN), userControllers.readProfile);

export const legacyUserRouter = legacyRouter;
