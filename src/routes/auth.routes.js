import express from 'express';
import { login, register, deleteUser } from '../controllers/auth.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/login', login);

// Solo los administradores pueden registrar usuarios nuevos
router.post('/register', authenticate, authorizeRoles('admin'), register);

router.delete('/user/:id', authenticate, authorizeRoles('admin'), deleteUser);

router.post('/register-client', authenticate, authorizeRoles('admin', 'asesor'), async (req, res) => {
    try {
      const { name, email, password, phone } = req.body;
      const fixedRole = 'cliente';
      const userData = { name, email, password, phone, rol: fixedRole };
      req.body = userData;
      return register(req, res);
  
    } catch (error) {
      res.status(500).json({ message: 'Error al registrar cliente', error });
    }
  });
  
  

export default router;
