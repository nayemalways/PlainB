import express from 'express';
import { authController } from './auth.controller.ts';

const router = express.Router();

router.post('/login', authController.login);
router.post('/verify', authController.VerifyLoginOTP);
router.get('/logout', authController.userLogout);

export const authRouter = router;
