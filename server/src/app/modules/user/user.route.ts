
import  express  from 'express';
import { userController } from './user.controller.ts';


const router = express.Router();

// router.post('/login', userController.UserOTP);

export const userRouter = router;