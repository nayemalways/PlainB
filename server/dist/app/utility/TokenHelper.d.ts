import jwt from "jsonwebtoken";
export declare const TokenEncode: (email: any, user_id: any) => never;
export declare const DecodeToken: (token: any) => string | jwt.JwtPayload;
