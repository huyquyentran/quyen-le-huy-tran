import { Container } from 'typedi';
import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authMiddleware } from './auth.middleware';
import { Tspec } from 'tspec';
import { LoginReqDTO } from './dtos/login-req.dto';
import { RegisterReqDTO } from './dtos/register-req.dto';
import { RefreshTokenReqDTO } from './dtos/refresh-token-req.dto';

export const authRouter = Router();
const authController = Container.get(AuthController);

authRouter.post('/login', authController.login);
authRouter.post('/register', authController.register);
authRouter.post('/refresh-token', authController.refreshToken);
authRouter.get('/me', authMiddleware, authController.getUserInfo);

// Swagger spec for the Auth API
export type AuthApiSpec = Tspec.DefineApiSpec<{
  basePath: '/v1/auth';
  paths: {
    '/login': {
      post: {
        tags: ['Auth'];
        summary: 'Login';
        handler: typeof authController.login;
        body: LoginReqDTO;
      };
    };
    '/register': {
      post: {
        tags: ['Auth'];
        summary: 'Register';
        handler: typeof authController.register;
        body: RegisterReqDTO;
      };
    };
    '/refresh-token': {
      post: {
        tags: ['Auth'];
        summary: 'Refresh token';
        handler: typeof authController.refreshToken;
        body: RefreshTokenReqDTO;
      };
    };
    '/me': {
      get: {
        tags: ['Auth'];
        security: 'BearerAuth';
        summary: 'Get user info';
        handler: typeof authController.getUserInfo;
      };
    };
  };
}>;
