
import  express  from 'express';
import { authController } from './auth.controller.ts';


const router = express.Router();

router.post('/login', authController.login);
router.post('/verify', authController.VerifyLoginOTP);

export const authRouter = router;