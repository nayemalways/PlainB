import { DecodeToken } from '../utility/TokenHelper.ts';
import { SendResponse } from '../utility/SendResponse.ts';

export const UserAuthentication = async (req, res, next) => {
  const token = req.headers['token'];

  // Token Decode
  const Decoded = DecodeToken(token);

  if (Decoded === null) {
    return SendResponse(res, {
      success: false,
      statusCode: 401,
      message: 'Unauthorized',
      data: null,
    });
  } else {
    const email = Decoded.email;
    const user_id = Decoded.user_id;

    req.headers.email = email;
    req.headers.user_id = user_id;

    next();
  }
};
