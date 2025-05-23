import express from 'express';
import {
  getUsersByRole,
  updateUser,
  getUser
} from '../controllers/user.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';
import { validatePagination } from '../middleware/validatePagination.middleware.js';

const router = express.Router();

// Listar usuarios por rol con paginación
router.get('/rol', authenticate, authorizeRoles('admin'), validatePagination, getUsersByRole);

// Obtener usuario por ID, correo, nombre o teléfono (query param)
router.get('/search', authenticate, authorizeRoles('admin'), getUser);

// Actualizar usuario por ID
router.put('/:id', authenticate, authorizeRoles('admin'), updateUser);

export default router;
