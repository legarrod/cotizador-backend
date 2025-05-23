import {
    getUsersByRoleModel,
    updateUserModel,
    getUserModel
  } from '../models/user.model.js';
  
  export const getUsersByRole = async (req, res) => {
    try {
      const { rol, page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
      const users = await getUsersByRoleModel(rol, Number(limit), Number(offset));
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ message: 'Error al obtener usuarios por rol', error });
    }
  };
  
  export const getUser = async (req, res) => {
    try {
      const { id, email, name, phone } = req.query;
  
      const user = await getUserModel({ id, email, name, phone });
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
  
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: 'Error al obtener usuario', error });
    }
  };
  
  export const updateUser = async (req, res) => {
    try {
      const result = await updateUserModel(req.params.id, req.body);
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
  
      return res.status(200).json({ message: 'Usuario actualizado exitosamente' });
    } catch (error) {
      return res.status(500).json({ message: 'Error al actualizar usuario', error });
    }
  };