import { verifyToken } from '../utils/jwt.js';
import { findUserByEmail } from '../models/user.model.js'

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Acceso no autorizado' });

  try {
    req.user = verifyToken(token);
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

export const authorizeRoles = (...rol) => {
  return async (req, res, next) => {
    const searchUser = await findUserByEmail(req.headers.user);
    if (searchUser === undefined || !rol.includes(searchUser.rol)) {
      return res.status(403).json({ message: 'Acceso no autorizado' });
    }
    next();
  };
};

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'Acceso no autorizado' });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Token inválido' });
      }
      req.user = user;
      next();
    });
  };
  
  export default authenticateToken;
