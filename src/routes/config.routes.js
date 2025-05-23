import express from 'express';
import { createConfig, getAllConfigs, getConfigById, updateConfig, deleteConfig } from '../controllers/config.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', authenticate, authorizeRoles('admin'), createConfig);
router.get('/', authenticate, authorizeRoles('admin'), getAllConfigs);
router.get('/:id', authenticate, authorizeRoles('admin'), getConfigById);
router.put('/:id', authenticate, authorizeRoles('admin'), updateConfig);
router.delete('/:id', authenticate, authorizeRoles('admin'), deleteConfig);

export default router;