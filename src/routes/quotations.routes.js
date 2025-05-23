import express from 'express';
import {
  createQuotation,
  getAllQuotations,
  getQuotationById,
  updateQuotation,
  deleteQuotation,
  sendQuotationEmail
} from '../controllers/quotation.controller.js';

import multer from 'multer';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';

// Configuración de multer para manejar la subida de archivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

// Crear una cotización
router.post('/', authenticate, authorizeRoles('admin', 'asesor'), createQuotation);

// Obtener todas las cotizaciones
router.get('/all', authenticate, authorizeRoles('admin', 'asesor'), getAllQuotations);

// Obtener una cotización por ID
router.get('/:id', authenticate, authorizeRoles('admin', 'asesor'), getQuotationById);

// Actualizar una cotización
router.put('/:id', authenticate, authorizeRoles('admin', 'asesor'), updateQuotation);

// Eliminar una cotización
router.delete('/:id', authenticate, authorizeRoles('admin'), deleteQuotation);

// Exportar y enviar cotización por correo
router.post('/:id/send', authenticate, authorizeRoles('admin', 'asesor'), sendQuotationEmail);

  router.post('/send-pdf', authenticate, authorizeRoles('admin', 'asesor'), upload.single('pdf'), async (req, res) => {
    try {
      const { email } = req.body;  // Asegúrate de enviar el email junto con el PDF
      const pdfBuffer = req.file.buffer;  // El archivo PDF que se subió
  
      // Enviar el correo con el archivo PDF adjunto
      await sendEmail(email, pdfBuffer);
  
      res.status(200).json({ message: 'Cotización enviada exitosamente por correo.' });
    } catch (error) {
      console.error('Error al enviar cotización', error);
      res.status(500).json({ message: 'Hubo un error al enviar la cotización.' });
    }
  });

export default router;
