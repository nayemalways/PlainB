
import  express  from 'express';
import { userController } from './user.controller.js';


const router = express.Router();

// router.post('/login', userController.UserOTP);

export const userRouter = router;