// src/middleware/sqlInjectionGuard.js
const sqlKeywords = /(\b(SELECT|INSERT|DELETE|UPDATE|DROP|UNION|--|;)\b)/gi;

export const sqlInjectionGuard = (req, res, next) => {
  const hasInjection = (value) => typeof value === 'string' && sqlKeywords.test(value);

  for (const key in req.body) {
    if (hasInjection(req.body[key])) {
      return res.status(400).json({ message: 'Input inválido detectado (posible SQL Injection).' });
    }
  }

  for (const key in req.query) {
    if (hasInjection(req.query[key])) {
      return res.status(400).json({ message: 'Parámetro inválido detectado (posible SQL Injection).' });
    }
  }

  next();
};
