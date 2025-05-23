// src/routes/services.routes.js
import express from 'express';
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
} from '../controllers/service.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', authenticate, authorizeRoles('admin', 'asesor'), createService);
router.get('/', authenticate, authorizeRoles('admin', 'asesor'), getAllServices);
router.get('/:id', authenticate, authorizeRoles('admin', 'asesor'), getServiceById);
router.put('/:id', authenticate, authorizeRoles('admin', 'asesor'), updateService);
router.delete('/:id', authenticate, authorizeRoles('admin'), deleteService);

export default router;
