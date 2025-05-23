// cotizador-backend/index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import db from './src/config/db.js';
import authRoutes from './src/routes/auth.routes.js';
import userRoutes from './src/routes/users.routes.js';
import serviceRoutes from './src/routes/services.routes.js';
import quotationRoutes from './src/routes/quotations.routes.js';
import configRoutes from './src/routes/config.routes.js';

import { apiLimiter } from './src/middleware/rateLimiter.js';
import { blockIPsMiddleware } from './src/middleware/blockIPs.js';
import { sqlInjectionGuard } from './src/middleware/sqlInjectionGuard.js';
import { applySecurityMiddlewares } from './src/middleware/securityMiddleware.js';
import { useHelmet } from './src/middleware/helmetMiddleware.js';

// Inicializar variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();

useHelmet(app);
applySecurityMiddlewares(app);

// Middleware por orden
app.use(blockIPsMiddleware);
app.use(apiLimiter);
app.use(sqlInjectionGuard);

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Conexión a la base de datos
(async () => {
  try {
    await db();
    console.log('Conexión a la base de datos exitosa');
  } catch (error) {
    console.error('Error conectando a la base de datos:', error);
    process.exit(1);
  }
})();

// Definición de rutas principales
app.use('/api/auth', authRoutes); // Login y autenticación
app.use('/api/users', userRoutes); // CRUD de usuarios (clientes, asesores, admins)
app.use('/api/services', serviceRoutes); // CRUD de servicios turísticos
app.use('/api/quotations', quotationRoutes); // Crear, listar, exportar cotizaciones
app.use('/api/config', configRoutes); // Configuración general del sistema

// Ruta por defecto
app.get('/', (req, res) => {
  res.send('API de Cotizador de Servicios Turísticos');
});

// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
