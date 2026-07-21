import { Response } from 'express';
import { NODE_ENV } from '../config/config.ts';

interface AuthTokenInfo {
  accessToken?: string;
  refreshToken?: string;
}

export const SetCookies = (res: Response, tokenInfo: AuthTokenInfo) => {
  if (tokenInfo.accessToken) {
    res.cookie('accessToken', tokenInfo.accessToken, {
      httpOnly: false,
      secure: NODE_ENV === "development" ? false : true, 
      sameSite: NODE_ENV === "development" ? 'lax' : 'none', 
    });
  }

  if (tokenInfo.refreshToken) {
    res.cookie('refreshToken', tokenInfo.refreshToken, {
      httpOnly: true, 
      secure: NODE_ENV === "development" ? false : true,
      sameSite: NODE_ENV === "development" ? 'lax' : 'none'
    });
  }
};

