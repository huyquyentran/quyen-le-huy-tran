import dotenv from 'dotenv';
dotenv.config();

export const dbConfig = {
  dbHost: process.env.DATABASE_HOST,
  dbPort: Number(process.env.DATABASE_PORT),
  dbDatabase: process.env.DATABASE_NAME,
  dbUsername: process.env.DATABASE_USER,
  dbPassword: process.env.DATABASE_PASSWORD,
};
