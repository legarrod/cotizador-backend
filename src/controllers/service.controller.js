// src/controllers/service.controller.js
import {
  createItemModel,
  getAllItemsModel,
  getItemByIdModel,
  updateItemModel,
  deleteItemModel,
} from '../models/service.model.js';

export const createService = async (req, res) => {
  try {
    const result = await createItemModel(req.body);
    return res.status(201).json({ id: result.insertId, message: 'Servicio creado exitosamente' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear servicio', error });
  }
};

export const getAllServices = async (_req, res) => {
  try {
    const services = await getAllItemsModel();
    return res.status(200).json(services);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener servicios', error });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const service = await getItemByIdModel(req.params.id);
    if (!service) return res.status(404).json({ message: 'Servicio no encontrado' });
    return res.status(200).json(service);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener servicio', error });
  }
};

export const updateService = async (req, res) => {
  try {
    const result = await updateItemModel(req.params.id, req.body);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Servicio no encontrado' });
    return res.status(200).json({ message: 'Servicio actualizado exitosamente' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar servicio', error });
  }
};

export const deleteService = async (req, res) => {
  try {
    const result = await deleteItemModel(req.params.id);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Servicio no encontrado' });
    return res.status(200).json({ message: 'Servicio eliminado exitosamente' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar servicio', error });
  }
};
