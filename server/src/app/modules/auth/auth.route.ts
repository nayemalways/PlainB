import express from 'express';
import { authController } from './auth.controller.ts';
import { checkAuth } from '../../middlewares/AuthMiddleware.ts';
import { Role } from '../user/user.interface.ts';
import passport from 'passport';


const router = express.Router();

// CREDENTIAL LOGIN
router.post('/login', authController.credentialsLogin);
router.get('/session', checkAuth(Role.USER, Role.ADMIN), authController.session);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.userLogout);
router.get('/logout', authController.userLogout);

// GOOGLE LOGIN
router.get('/google', authController.googleRegister);
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  authController.googleCallback
);

export const authRouter = router;
