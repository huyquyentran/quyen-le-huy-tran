import { AuthService } from './auth.service';
import { RegisterReqSchema } from './dtos/register-req.dto';
import { refreshTokenSchema } from './dtos/refresh-token-req.dto';
import { NextFunction, Request, Response } from 'express';
import { Service } from 'typedi';
import { LoginReqSchema } from './dtos/login-req.dto';
import { LoginResDTO } from './dtos/login-res';
import { CurrentUser } from './dtos/current-user';

@Service()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  login = async (req: Request, res: Response<LoginResDTO>, next: NextFunction) => {
    try {
      const payload = LoginReqSchema.parse(req.body);
      const result = await this.authService.login(payload);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = RegisterReqSchema.parse(req.body);
      await this.authService.register(payload);
      return res.status(201).json();
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response<LoginResDTO>, next: NextFunction) => {
    try {
      const payload = refreshTokenSchema.parse(req.body);
      const result = await this.authService.refreshToken(payload.refreshToken);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getUserInfo = (req: Request, res: Response<CurrentUser>) => {
    return res.json(req.user);
  };
}
