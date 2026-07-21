import { StatusCodes } from 'http-status-codes';
import AppError from '../../errorHelpers/appError.ts';
import { EmailSend } from '../../utility/EmailSender.ts';
import { createUserTokens } from '../../utility/generateAuthTokens.ts';
import User from '../user/user.model.ts';

// USER LOGIN
const loginService = async (email: string) => {
  const code = Math.floor(100000 + Math.random() * 900000);
  const EmailSub = `User Login OTP Verification`;
  const EmailText = ``;
  const EmailHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Login Code</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 8px;
        }
        .header {
            text-align: center;
            padding: 10px 0;
        }
        .header h1 {
            color: #4CAF50;
            font-size: 24px;
        }
        .otp {
            font-size: 24px;
            color: #4CAF50;
            font-weight: bold;
            text-align: center;
            padding: 20px 0;
        }
        .message {
            font-size: 16px;
            line-height: 1.6;
            margin: 20px 0;
            text-align: center;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #888;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to MERN-SHOP</h1>
        </div>
        <div class="message">
            <p>Use the following OTP to complete your login:</p>
        </div>
        <div class="otp">
            ${code}
        </div>
        <div class="message">
            <p>If you did not request this, please ignore this email.</p>
        </div>
        <div class="footer">
            &copy; 2024 MERN-SHOP. All rights reserved.
        </div>
    </div>
</body>
</html>
`;

  /*---------EMAIL SEND TO USERS MAIL---------*/
  const mailSender = await EmailSend({
    emailTo: email,
    emailSubject: EmailSub,
    emailText: EmailText,
    emailHTMLBody: EmailHTML
  });

  if (!mailSender) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'OTP is not been sent');
  }  

  await User.updateOne({ email: email }, { $set: { otp: code } }, { upsert: true });
    return {
      status: 'Success',
      message: '6 Digit OTP has been sent successfully',
    };
};

// VERIFY LOGIN OTP
const VerifyLoginOTP = async (email: string, otp: string) => {
  if (!email || !otp) {
    throw new Error(`Missing email or otp`);
  }

  /*----------OTP MATCHING------------*/
  const data = await User.find({ email, otp });

  if (!data || data.length === 0) {
    throw new Error('Invalid credentials');
  }

  /*-------ENCODED USER MAIL AND ID INTO TOKEN---------*/
  const userTokens = await createUserTokens(data);

  /*-----------OTP RESET AFTER LOGGED IN------------*/
  await User.updateOne({ email: email }, { otp: '0' });

  /*----------------RETURN STATUS------------------*/
  return userTokens;
};

export const authService = {
  loginService,
  VerifyLoginOTP,
};
