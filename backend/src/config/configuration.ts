import { ValidationError, ValidatorOptions } from 'class-validator';

const backendPort = parseInt(process.env.BACKEND_PORT ?? '3001', 10);

export default () => ({
  port: backendPort,
  dbHost: process.env.DB_HOST,
  dbPort: parseInt(process.env.DB_PORT ?? '5432', 10),
  dbName: process.env.DB_NAME,
  dbUser: process.env.DB_USER,
  dbPass: process.env.DB_PASS,
  backendUrl: process.env.BACKEND_URL || `http://localhost:${backendPort}`,
  smtpUser: process.env.SMTP_USER || 'user@teste.com',
  smtpPassword: process.env.SMTP_PASSWORD || 'asjkdbadwndoalwddw',
});

export interface ValidationPipeOptions extends ValidatorOptions {
  transform?: boolean;
  disableErrorMessages?: boolean;
  exceptionFactory?: (errors: ValidationError[]) => any;
}
