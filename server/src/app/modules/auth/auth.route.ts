import express from 'express';
import { authController } from './auth.controller.ts';
import { checkAuth } from '../../middlewares/AuthMiddleware.ts';
import { Role } from '../user/user.interface.ts';

const router = express.Router();

router.post('/login', authController.login);
router.post('/verify', authController.VerifyLoginOTP);
router.get('/session', checkAuth(Role.USER, Role.ADMIN), authController.session);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.userLogout);
router.get('/logout', authController.userLogout);

export const authRouter = router;
