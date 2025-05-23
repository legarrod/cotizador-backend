// src/middleware/blockIPs.js
const blockedIPs = ['192.168.0.10', '123.123.123.123']; // puedes gestionar esto con Redis si es dinámico

export const blockIPsMiddleware = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  if (blockedIPs.includes(ip)) {
    return res.status(403).json({ message: 'Acceso denegado desde esta IP.' });
  }
  next();
};
