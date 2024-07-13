import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { appConfig } from './config/app.config';
import { dataSource } from './database/datasource';
import { Server } from 'http';
import { logger } from './shared/logger';
import { authRouter } from './auth/auth.route';
import { ZodError } from 'zod';
import { CurrentUser } from 'auth/dtos/current-user';
import { notesRouter } from './notes/notes.route';
import { TspecDocsMiddleware } from 'tspec';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('../package.json');

declare module 'express-serve-static-core' {
  interface Request {
    user?: CurrentUser;
  }
}

export class App {
  private app: express.Application = express();
  private port: number = appConfig.port;
  private server?: Server;

  public async init() {
    await this.connectToDatabase();
    this.setupMiddlewares();
    this.registerHealthCheckRoute();
    this.registerRoutes();
    this.registerErrorHandler();
    await this.setupSwagger();
    this.server = this.app.listen(this.port, () => {
      logger.info(`App listening on the port ${this.port}`);
    });
  }

  public async shutdown() {
    logger.info('Received shutdown signal, shutting down gracefully...');

    // Close the server
    this.server?.close(async () => {
      logger.info('HTTP server closed');

      try {
        // Close the database connection
        await dataSource.destroy();
        logger.info('Database connection closed');
        process.exit(0);
      } catch (err) {
        logger.error('Error during database disconnection:', err);
        process.exit(1);
      }
    });
  }

  private setupMiddlewares() {
    this.app.use(cors({ origin: appConfig.corsOrigin }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private async connectToDatabase() {
    await dataSource.initialize();
  }

  private registerRoutes() {
    this.app.use('/v1/auth', authRouter);
    this.app.use('/v1/notes', notesRouter);
  }

  private registerHealthCheckRoute() {
    this.app.get('/health', (req, res) => {
      res.send('OK');
    });
  }

  private registerErrorHandler() {
    this.app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
      logger.error(err);

      if (err instanceof ZodError) {
        return res.status(400).json({
          message: 'Validation error',
          errors: err.errors,
        });
      }

      res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
    });
  }

  private async setupSwagger() {
    this.app.use(
      '/docs',
      await TspecDocsMiddleware({
        openapi: {
          securityDefinitions: {
            BearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
          description: packageJson.description,
          version: packageJson.version,
          title: packageJson.name,
        },
        debug: true,
      }),
    );
  }
}
