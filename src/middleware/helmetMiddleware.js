// src/middleware/helmetMiddleware.js
import helmet from 'helmet';

export const useHelmet = (app) => {
  app.use(helmet());
};
