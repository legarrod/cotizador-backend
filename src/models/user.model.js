import bcrypt from 'bcrypt';
import db from '../config/db.js';

export const findUserByEmail = async (email) => {
  const conn = await db();
  const [rows] = await conn.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

export const createUser = async ({name, email, phone, rol, password}) => {
  const conn = await db();
  await conn.query(
    'INSERT INTO users (name, email, phone, rol, password) VALUES (?, ?, ?, ?, ?)',
    [name, email, phone, rol, password]
  );
  return { name, email, phone, rol, password };
};

export const getUsersByRoleModel = async (rol, limit, page) => {
  const conn = await db();
  if (isNaN(limit) || isNaN(page) || limit <= 0 || page < 0) {
    throw new Error('Los parámetros "limit" y "page" deben ser números enteros positivos válidos');
  }

  try {
    const [rows] = await conn.query(
      'SELECT * FROM users WHERE rol = ? LIMIT ? OFFSET ?',
      [rol, limit, page]
    );
    const [countResult] = await conn.query(
      'SELECT COUNT(*) AS total FROM users WHERE rol = ?',
      [rol]
    );
    const totalItems = countResult[0].total;
    const totalPages = Math.ceil(totalItems / limit);
    return {
      items: rows,
      totalItems: totalItems,
      currentPage: page + 1,
      totalPages: totalPages,
      limit,
    };
  } catch(err) {
    return err;
  }
};

export const getUserModel = async ({ id, email, name, phone }) => {
  const conn = await db();

  const filters = [];
  const values = [];

  if (id) {
    filters.push('id = ?');
    values.push(id);
  }
  if (email) {
    filters.push('email = ?');
    values.push(email);
  }
  if (name) {
    filters.push('name LIKE ?');
    values.push(`%${name}%`);
  }
  if (phone) {
    filters.push('phone = ?');
    values.push(phone);
  }

  if (filters.length === 0) {
    throw new Error('Debe proporcionar al menos un criterio de búsqueda');
  }

  const sql = `SELECT * FROM users WHERE ${filters.join(' OR ')} LIMIT 1`;
  const [rows] = await conn.execute(sql, values);

  return rows[0];
};

export const updateUserModel = async (id, data) => {
  const conn = await db();

  const fields = [];
  const values = [];

  if (data.name !== undefined) {
    fields.push('name = ?');
    values.push(data.name);
  }
  if (data.email !== undefined) {
    fields.push('email = ?');
    values.push(data.email);
  }
  if (data.phone !== undefined) {
    fields.push('phone = ?');
    values.push(data.phone);
  }
  if (data.rol !== undefined) {
    fields.push('rol = ?');
    values.push(data.rol);
  }
  if (data.status !== undefined) {
    fields.push('status = ?');
    values.push(data.status);
  }
  if (data.password !== undefined) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    fields.push('password = ?');
    values.push(hashedPassword);
  }

  if (fields.length === 0) {
    throw new Error('No se proporcionaron campos para actualizar');
  }
  const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
  values.push(id);

  const [result] = await conn.execute(sql, values);
  return result;
};


export const deleteUserModel = async (id) => {
  const conn = await db();
  const [result] = await conn.execute('DELETE FROM users WHERE id = ?', [id]);
  return result;
};