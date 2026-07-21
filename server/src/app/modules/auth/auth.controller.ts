import { SendResponse } from '../../utility/SendResponse.ts';
import { authService } from './auth.service.ts';

const login = async (req, res) => {
  const email = req.body.email;
  const result = await authService.loginService(email);
  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Login OTP sent successfully',
    data: result,
  });
};

const VerifyLoginOTP = async (req, res, next) => {
  const { otp, email } = req.body;
  const result = await authService.VerifyLoginOTP(email, otp);

  // Set cookie

  const cookieOptions = {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
    httpOnly: true, // prevents JS access (XSS protection)
    secure: true, // cookie only sent over HTTPS (in production)
    sameSite: 'strict', // prevents CSRF (adjust if you need cross-site)
  };

  try {
    res.cookie('token', result['Token'], cookieOptions);
    SendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Verified',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// LOGOUT
const userLogout = async (req, res) => {
  // Remove cookie option by minus (-)
  const cookieOptions = { expires: new Date(Date.now() - 24 * 60 * 60 * 1000), httpOnly: false };
  res.cookie('token', '', cookieOptions);
  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Logout successful',
    data: null,
  });
};

export const authController = {
  login,
  VerifyLoginOTP,
  userLogout
};
