import { DataSource } from 'typeorm';
import { appConfig } from '../config/app.config';
import { dbConfig } from '../config/database.config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Environment } from '../shared/constant';
import path from 'path';
import { Token, Container } from 'typedi';

export const dataSource = new DataSource({
  type: 'postgres',
  host: dbConfig.dbHost,
  port: dbConfig.dbPort,
  username: dbConfig.dbUsername,
  password: dbConfig.dbPassword,
  database: dbConfig.dbDatabase,
  synchronize: false,
  migrationsRun: true,
  logging: appConfig.environment === Environment.Development,
  entities: [path.join(__dirname, '..', '/**/*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, 'migrations/*{.ts,.js}')],
  namingStrategy: new SnakeNamingStrategy(),
});

export const DATA_SOURCE_TOKEN = new Token('DATA_SOURCE_TOKEN');

Container.set(DATA_SOURCE_TOKEN, dataSource);
