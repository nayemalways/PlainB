import express from 'express';
 import { userControllers } from './user.controller.ts';
import { Role } from './user.interface.ts';
import { checkAuth } from '../../middlewares/AuthMiddleware.ts';

const router = express.Router();

router.post('/', checkAuth(Role.USER), userControllers.saveProfile);
router.get('/', checkAuth(Role.USER), userControllers.readProfile);

export const userRouter = router;
