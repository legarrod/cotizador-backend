import db from '../config/db.js';

// Crear cotización y sus ítems
export const createQuotationModel = async (quotation) => {
  const conn = await db();

  const [result] = await conn.query(
    `INSERT INTO quotations (client_id, advisor_id, total, personalized_message, notes, created_at)
     VALUES (?, ?, ?, ?, ?, NOW())`,
    [
      quotation.client_id,
      quotation.advisor_id,
      quotation.totalPrice,
      quotation.personalized_message,
      quotation.notes
    ]
  );
  // Crear los ítems asociados a esta cotización
  for (const item of quotation.items) {
    await conn.query(
      `INSERT INTO quotation_items (quotation_id, item_id, quantity, unit_price)
       VALUES (?, ?, ?, ?)`,
      [result.insertId, item.id, item.quantity, item.price]
    );
  }

  return { insertId: result.insertId };
};

export const getAllQuotationsModel = async (limit, page) => {
  const conn = await db();

  // Validación de los parámetros
  if (isNaN(limit) || isNaN(page) || limit <= 0 || page < 0) {
    throw new Error('Los parámetros "limit" y "page" deben ser números enteros positivos válidos');
  }

  const offset = page * limit;

  try {
    // Obtener las cotizaciones paginadas
    const [quotations] = await conn.query(`
      SELECT q.*, u1.name AS client_name, u2.name AS advisor_name
      FROM quotations q
      JOIN users u1 ON q.client_id = u1.id
      JOIN users u2 ON q.advisor_id = u2.id
      ORDER BY q.created_at DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]);

    // Contar el total de cotizaciones
    const [countResult] = await conn.query(`
      SELECT COUNT(*) AS total FROM quotations
    `);
    const totalItems = countResult[0].total;
    const totalPages = Math.ceil(totalItems / limit);

    // Obtener y estructurar los ítems para cada cotización
    for (const quotation of quotations) {
      const [items] = await conn.query(
        `SELECT qi.*, i.name, i.description, i.category, i.type
         FROM quotation_items qi
         JOIN items i ON qi.item_id = i.id
         WHERE qi.quotation_id = ?`,
        [quotation.id]
      );

      quotation.client = {
        id: quotation.client_id,
        name: quotation.client_name,
      };
      quotation.advisor = {
        id: quotation.advisor_id,
        name: quotation.advisor_name,
      };

      delete quotation.client_id;
      delete quotation.client_name;
      delete quotation.advisor_id;
      delete quotation.advisor_name;

      quotation.items = items;
    }

    return {
      items: quotations,
      totalItems,
      currentPage: page + 1,
      totalPages,
      limit,
    };

  } catch (err) {
    throw err;
  }
};



export const updateQuotationModel = async (id, data) => {
  const conn = await db();
  try {
    // Obtener los valores actuales para no perder los que no se actualicen
    const [[existing]] = await conn.query('SELECT * FROM quotations WHERE id = ?', [id]);
    if (!existing) throw new Error('Cotización no encontrada');

    // Preparar los valores a actualizar, manteniendo los existentes si no se envían nuevos
    const fields = {
      ...data,
      client_id: data.client_id ?? existing.client_id,
      advisor_id: data.advisor_id ?? existing.advisor_id,
      total: data.totalPrice ?? existing.total,
      personalized_message: data.personalized_message ?? existing.personalized_message,
      notes: data.notes ?? existing.notes
    };

    // Ejecutar el UPDATE con los campos actualizados
    await conn.query(
      `UPDATE quotations
       SET client_id = ?, advisor_id = ?, total = ?, personalized_message = ?, notes = ?
       WHERE id = ?`,
      [
        fields.client_id,
        fields.advisor_id,
        fields.total,
        fields.personalized_message,
        fields.notes,
        id
      ]
    );

    // Si se proporcionan nuevos ítems, reemplazarlos
    if (Array.isArray(fields.items)) {
      await conn.query('DELETE FROM quotation_items WHERE quotation_id = ?', [id]);
      for (const item of fields.items) {
        await conn.query(
          `INSERT INTO quotation_items (quotation_id, item_id, quantity, unit_price)
           VALUES (?, ?, ?, ?)`,
          [id, item.id, item.quantity, item.price]
        );
      }
    }

    return { updated: true };
  } catch (error) {
    throw error;
  }
};


export const getQuotationByIdModel = async (id) => {
  const conn = await db();
  const [[quotation]] = await conn.query(
    `SELECT q.*, 
            client.name AS client_name,
            advisor.name AS advisor_name
     FROM quotations q
     LEFT JOIN users client ON q.client_id = client.id
     LEFT JOIN users advisor ON q.advisor_id = advisor.id
     WHERE q.id = ?`,
    [id]
  );
  if (!quotation) return null;


  const [items] = await conn.query(
    `SELECT qi.*, i.name, i.description, i.category, i.type
     FROM quotation_items qi
     JOIN items i ON qi.item_id = i.id
     WHERE qi.quotation_id = ?`,
    [id]
  );

  return {
    id: quotation.id,
    client: {
      id: quotation.client_id,
      name: quotation.client_name
    },
    advisor: {
      id: quotation.advisor_id,
      name: quotation.advisor_name
    },
    created_at: quotation.created_at,
    total: quotation.total,
    personalized_message: quotation.personalized_message,
    pdf_file: quotation.pdf_file,
    email_sent: quotation.email_sent,
    notes: quotation.notes,
    items
  };

};

export const deleteQuotationModel = async (id) => {
  const conn = await db();
  const [result] = await conn.query('DELETE FROM quotations WHERE id = ?', [id]);
  return result;
};



