import { authService } from "./auth.service.js";

const login = async (req, res) => {
  const email = req.body.email;
  const result = await authService.loginService(email);
  res.json(result);
};

const VerifyLoginOTP = async (req, res) => {
  const {otp, email} = req.body;
  const result = await authService.VerifyLoginOTP(email, otp);

  // Set cookie
  if (result["status"] === "Success") {
    const cookieOptions = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      httpOnly: true, // prevents JS access (XSS protection)
      secure: true, // cookie only sent over HTTPS (in production)
      sameSite: "strict", // prevents CSRF (adjust if you need cross-site)
    };

    res.cookie("token", result["Token"], cookieOptions);
    res.json(result);
  } else {
    res.json(result);
  }
};

export const authController = {
  login,
  VerifyLoginOTP,
};
