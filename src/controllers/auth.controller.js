import bcrypt from 'bcrypt';
import { findUserByEmail, createUser, deleteUserModel } from '../models/user.model.js';
import { generateToken } from '../utils/jwt.js';

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).json({ message: 'Credenciales incorrectas' });

  const token = generateToken(user);
  res.json({ token, user: { id: user.id, name: user.name, rol: user.rol } });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, rol } = req.body;
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: `El correo ${email} electrónico ya está registrado.` });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser({
      name,
      email,
      phone,
      rol,
      password: hashedPassword,
    });

    return res.status(201).json({ message: 'Usuario registrado exitosamente', user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error registrando usuario', error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const result = await deleteUserModel(req.params.id);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    return res.status(200).json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar usuario', error });
  }
};