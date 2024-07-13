import dotenv from 'dotenv';
dotenv.config();
import { Environment } from '../shared/constant';

export const appConfig = {
  environment: process.env.NODE_ENV || Environment.Development,
  port: Number(process.env.PORT),
  corsOrigin: process.env.CORS_ORIGIN || '*',
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET!,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET!,
  accessTokenExpiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN) || 60 * 15, // 15 minutes
  refreshTokenExpiresIn: Number(process.env.REFRESH_TOKEN_EXPIRES_IN) || 60 * 60 * 24 * 7, // 7 days,
};
