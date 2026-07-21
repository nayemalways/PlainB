import { sendResponse } from "../../utility/sendResponse.ts";
import { authService } from "./auth.service.ts";

const login = async (req, res) => {
  const email = req.body.email;
  const result = await authService.loginService(email);
  res.json(result);
};

const VerifyLoginOTP = async (req, res, next) => {
  const { otp, email } = req.body;
  const result = await authService.VerifyLoginOTP(email, otp);

  // Set cookie

  const cookieOptions = {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
    httpOnly: true, // prevents JS access (XSS protection)
    secure: true, // cookie only sent over HTTPS (in production)
    sameSite: "strict", // prevents CSRF (adjust if you need cross-site)
  };

  try {
    res.cookie("token", result["Token"], cookieOptions);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Verified",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const authController = {
  login,
  VerifyLoginOTP,
};
