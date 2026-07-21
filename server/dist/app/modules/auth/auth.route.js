import express from 'express';
import { authController } from "./auth.controller.js";
const router = express.Router();
router.post('/login', authController.login);
router.post('/verify', authController.VerifyLoginOTP);
export const authRouter = router;
//# sourceMappingURL=auth.route.js.map