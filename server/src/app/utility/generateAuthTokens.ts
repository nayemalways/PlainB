import { JwtPayload } from "jsonwebtoken";
import { generateToken } from "./TokenHelper.ts";
import { JWT_EXPIRATIONS_TIME, JWT_REFRESH_EXPIRATION, JWT_REFRESH_SECRET, JWT_SECRET } from "../config/config.ts";

export const createUserTokens = async (user: JwtPayload) => {
  const jwtPayload  = {
    userId: user?._id,
    email: user?.email,
    role: user?.role
  };

  // Jsonwebtoken
  const accessToken = generateToken(
    jwtPayload,
    JWT_SECRET,
    JWT_EXPIRATIONS_TIME
  );
  const refreshToken = generateToken(
    jwtPayload,
    JWT_REFRESH_SECRET,
    JWT_REFRESH_EXPIRATION
  );

  return {
    accessToken,
    refreshToken,
  };
};