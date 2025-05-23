// src/models/item.model.js
import db from '../config/db.js';

export const createItemModel = async ({ name, description, price, category, type = 'service', status = 'active' }) => {
  const pool = await db();
  const [result] = await pool.execute(
    `INSERT INTO items (name, description, price, category, type, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, description, price, category, type, status]
  );
  return result;
};

export const getAllItemsModel = async () => {
  const pool = await db();
  const [rows] = await pool.execute('SELECT * FROM items');
  return rows;
};

export const getItemByIdModel = async (id) => {
  const pool = await db();
  const [rows] = await pool.execute('SELECT * FROM items WHERE id = ?', [id]);
  return rows[0];
};

export const updateItemModel = async (id, data) => {
  const pool = await db();
  const fields = [];
  const values = [];

  if (data.name !== undefined) {
    fields.push('name = ?');
    values.push(data.name);
  }
  if (data.description !== undefined) {
    fields.push('description = ?');
    values.push(data.description);
  }
  if (data.price !== undefined) {
    fields.push('price = ?');
    values.push(data.price);
  }
  if (data.category !== undefined) {
    fields.push('category = ?');
    values.push(data.category);
  }
  if (data.type !== undefined) {
    fields.push('type = ?');
    values.push(data.type);
  }
  if (data.status !== undefined) {
    fields.push('status = ?');
    values.push(data.status);
  }

  if (fields.length === 0) {
    throw new Error('No fields provided for update');
  }

  const sql = `UPDATE items SET ${fields.join(', ')} WHERE id = ?`;
  values.push(id);

  const [result] = await pool.execute(sql, values);
  return result;
};

export const deleteItemModel = async (id) => {
  const pool = await db();
  const [result] = await pool.execute('DELETE FROM items WHERE id = ?', [id]);
  return result;
};
