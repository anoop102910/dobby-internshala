import { cleanEnv, str, port, url, num } from 'envalid';
import dotenv from 'dotenv';

dotenv.config();

const env = cleanEnv(process.env, {
  PORT: port(),
  MONGODB_URI: url(),
  JWT_SECRET: str(),
  JWT_EXPIRATION_TIME: str(),
  NODE_ENV: str({ choices: ['development', 'test', 'production'] }),
  FRONTEND_URL: url(),
  SMTP_HOST: str({ default: 'smtp.gmail.com' }),
  SMTP_PORT: port({ default: 587 }),
  SMTP_USER: str(),
  SMTP_PASS: str(),
  FROM_EMAIL: str(),
  CLOUDINARY_CLOUD_NAME: str(),
  CLOUDINARY_API_KEY: str(),
  CLOUDINARY_API_SECRET: str(),
  CLOUDINARY_FOLDER: str(),
  FILE_UPLOAD_LIMIT: num(),
});

export const config = {
  port: env.PORT,
  database: {
    url: env.MONGODB_URI,
  },
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRATION_TIME,
  },
  cors: {
    origin: env.FRONTEND_URL,
  },
  nodeEnv: env.NODE_ENV,
  email: {
    smtp: {
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
    from: env.FROM_EMAIL,
  },
  fileUpload: {
    limit: env.FILE_UPLOAD_LIMIT,
  },
  cloudinary: {
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    apiSecret: env.CLOUDINARY_API_SECRET,
    folder: env.CLOUDINARY_FOLDER,
  },
} as const;
