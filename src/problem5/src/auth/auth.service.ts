import { Inject, Service } from 'typedi';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { LoginReqDTO } from './dtos/login-req.dto';
import { RegisterReqDTO } from './dtos/register-req.dto';
import { DataSource, Repository } from 'typeorm';
import { User } from '../users/user.entity';
import createHttpError from 'http-errors';
import { LoginResDTO } from './dtos/login-res';
import { appConfig } from '../config/app.config';
import { CurrentUser } from './dtos/current-user';
import { DATA_SOURCE_TOKEN } from '../database/datasource';

@Service()
export class AuthService {
  private readonly usersRepository: Repository<User>;

  constructor(@Inject(DATA_SOURCE_TOKEN) readonly dataSource: DataSource) {
    this.usersRepository = dataSource.getRepository(User);
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async generateTokens(user: User): Promise<LoginResDTO> {
    const tokenPayload: CurrentUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    const accessToken = jwt.sign(tokenPayload, appConfig.accessTokenSecret, {
      expiresIn: appConfig.accessTokenExpiresIn,
    });

    const refreshToken = jwt.sign(tokenPayload, appConfig.refreshTokenSecret, {
      expiresIn: appConfig.refreshTokenExpiresIn,
    });

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      accessTokenExpiresIn: appConfig.accessTokenExpiresIn,
      refreshTokenExpiresIn: appConfig.refreshTokenExpiresIn,
    };
  }

  async verifyRefreshToken(token: string): Promise<CurrentUser> {
    try {
      const decoded = jwt.verify(token, appConfig.refreshTokenSecret, {
        ignoreExpiration: false,
      });

      return decoded as CurrentUser;
    } catch (error) {
      throw new createHttpError.Unauthorized('Token is expired');
    }
  }

  async register(registerReqDTO: RegisterReqDTO): Promise<void> {
    const { email, password } = registerReqDTO;

    const duplicatedUser = await this.usersRepository.findOneBy({ email });

    if (duplicatedUser) {
      throw new createHttpError.BadRequest(`Email '${email}' already exists, please choose another email`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.usersRepository.save({
      ...registerReqDTO,
      hashedPassword,
    });
  }

  async login(loginReqDTO: LoginReqDTO): Promise<LoginResDTO> {
    const { email, password } = loginReqDTO;

    const user = await this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'hashedPassword', 'firstName', 'lastName'],
    });
    if (!user) {
      throw new createHttpError.Unauthorized('Incorrect email or password');
    }

    const isValidPassword = await bcrypt.compare(password, user.hashedPassword);
    if (!isValidPassword) {
      throw new createHttpError.Unauthorized('Incorrect email or password');
    }

    return await this.generateTokens(user);
  }

  async refreshToken(refreshToken: string): Promise<LoginResDTO> {
    const decoded = await this.verifyRefreshToken(refreshToken);

    const user = await this.usersRepository.findOneByOrFail({ id: decoded.id });
    return await this.generateTokens(user);
  }
}
