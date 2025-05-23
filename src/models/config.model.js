// src/models/settings.model.js
import db from '../config/db.js';

export const createSettingsModel = async (data) => {
  const pool = await db();
  const [result] = await pool.execute(
    `INSERT INTO settings (
      company_name, company_phone, company_address, company_email, logo_url,
      quotation_message, business_hours, signature_url, company_nit, manager_name
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.company_name,
      data.company_phone,
      data.company_address,
      data.company_email,
      data.logo_url,
      data.quotation_message,
      JSON.stringify(data.business_hours),
      data.signature_url,
      data.company_nit,
      data.manager_name
    ]
  );
  return result;
};

export const getAllSettingsModel = async () => {
  const pool = await db();
  const [rows] = await pool.execute('SELECT * FROM settings');
  return rows;
};

export const getSettingsByIdModel = async (id) => {
  const pool = await db();
  const [rows] = await pool.execute('SELECT * FROM settings WHERE id = ?', [id]);
  return rows[0];
};

export const updateSettingsModel = async (id, data) => {
  const pool = await db();
  const fields = [];
  const values = [];

  for (const key in data) {
    if (Object.hasOwn(data, key)) {
      fields.push(`${key} = ?`);
      values.push(key === 'business_hours' ? JSON.stringify(data[key]) : data[key]);
    }
  }

  if (fields.length === 0) {
    throw new Error('No se proporcionaron campos para actualizar');
  }

  const sql = `UPDATE settings SET ${fields.join(', ')} WHERE id = ?`;
  values.push(id);

  const [result] = await pool.execute(sql, values);
  return result;
};

export const deleteSettingsModel = async (id) => {
  const pool = await db();
  const [result] = await pool.execute('DELETE FROM settings WHERE id = ?', [id]);
  return result;
};
