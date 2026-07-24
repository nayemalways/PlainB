import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

export const generateToken = (
  payload: JwtPayload,
  secret: string,
  expired: string,
  options: SignOptions = {},
) => {
  const token = jwt.sign(payload, secret, {
    expiresIn: expired,
    ...options,
  } as SignOptions);

  return token;
};

export const verifyToken = (token: string, secret: string) => {
  const verified = jwt.verify(token, secret);
  return verified;
};
