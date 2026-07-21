import express from 'express';
import * as userController from './user.controller.ts';
import { UserAuthentication } from '../../middlewares/AuthMiddleware.ts';

const router = express.Router();

router.get('/UserOTP/:email', userController.UserOTP);
router.get('/OTPVerifyLogin/:email/:code', userController.OTPVerifyLogin);
router.get('/UserLogout', UserAuthentication, userController.UserLogout);
router.post('/SaveProfile', UserAuthentication, userController.SaveProfile);
router.get('/ReadProfile', UserAuthentication, userController.ReadProfile);

export const userRouter = router;
