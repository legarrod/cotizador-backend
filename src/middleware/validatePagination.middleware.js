// src/middleware/validatePagination.middleware.js

export const validatePagination = (req, res, next) => {
    const { limit, page } = req.query;
  
    // Validar que 'limit' y 'page' sean números enteros positivos
    const parsedLimit = parseInt(limit, 10);
    const parsedOffset = parseInt(page, 10);
  
    if (isNaN(parsedLimit) || parsedLimit <= 0) {
      return res.status(400).json({ message: '"limit" debe ser un número entero mayor que 0' });
    }
  
    if (isNaN(parsedOffset) || parsedOffset < 0) {
      return res.status(400).json({ message: '"page" debe ser un número entero mayor o igual a 0' });
    }
  
    // Si es válido, agregamos los valores a la solicitud
    req.query.limit = parsedLimit;
    req.query.page = parsedOffset;
  
    // Continuar con la solicitud
    next();
  };
  