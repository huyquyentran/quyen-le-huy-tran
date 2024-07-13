import { appConfig } from '../config/app.config';
import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { CurrentUser } from './dtos/current-user';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Get the JWT token from the request headers
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return next(new createHttpError.Unauthorized('No token provided'));
  }

  try {
    const decoded = jwt.verify(token, appConfig.accessTokenSecret, { ignoreExpiration: false });
    req.user = decoded as CurrentUser;

    next();
  } catch (error) {
    return next(new createHttpError.Unauthorized('Invalid token'));
  }
};
