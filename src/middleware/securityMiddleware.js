// src/middleware/securityMiddleware.js
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';

export const applySecurityMiddlewares = (app) => {
  app.use(xss()); // limpia entrada de scripts
  app.use(mongoSanitize()); // limpia $ y . en inputs
};
