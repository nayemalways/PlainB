import {
  UserOTPService,
  VerifyOTPService,
  SaveProfileService,
  ReadProfileService,
} from './user.service.ts';
import { SendResponse } from '../../utility/SendResponse.ts';

export const UserOTP = async (req, res) => {
  const result = await UserOTPService(req);
  SendResponse(res, {
    success: true,

    statusCode: 200,

    message: 'OTP sent successfully',

    data: result,
  });
};

export const OTPVerifyLogin = async (req, res) => {
  const result = await VerifyOTPService(req);

  // Set cookie
  if (result['status'] === 'Success') {
    const cookieOptions = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      httpOnly: true, // prevents JS access (XSS protection)
      secure: true, // cookie only sent over HTTPS (in production)
      sameSite: 'strict', // prevents CSRF (adjust if you need cross-site)
    };

    res.cookie('token', result['Token'], cookieOptions);
    SendResponse(res, {
      success: true,

      statusCode: 200,

      message: 'OTP verified successfully',

      data: result,
    });
  } else {
    SendResponse(res, {
      success: true,

      statusCode: 200,

      message: 'OTP verification failed',

      data: result,
    });
  }
};

export const UserLogout = async (req, res) => {
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

export const SaveProfile = async (req, res) => {
  const result = await SaveProfileService(req);
  SendResponse(res, {
    success: true,

    statusCode: 200,

    message: 'Profile saved successfully',

    data: result,
  });
};

export const ReadProfile = async (req, res) => {
  const result = await ReadProfileService(req);
  return SendResponse(res, {
    success: true,

    statusCode: 200,

    message: 'Profile retrieved successfully',

    data: result,
  });
};
