import express, { Express, Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config';
import { connectDatabase } from './config/database';
import { HTTP_STATUS } from './utils/httpStatus';
import authRoutes from './authModule/auth.routes';
import { ApiError } from './utils/ApiError';
import postRoutes from './postModule/post.routes';
import { PassportConfig } from './authModule/passport.config';

const app: Express = express();

// Connect to database
connectDatabase();

// Middleware
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Basic route
app.get('/', (_req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

// Error handling middleware
app.use(((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: err.message || 'Something went wrong!',
  });
}) as ErrorRequestHandler);

app.listen(config.port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${config.port}`);
});

export default app;