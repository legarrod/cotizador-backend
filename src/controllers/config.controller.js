// src/controllers/service.controller.js
import {
    createSettingsModel,
    getAllSettingsModel,
    getSettingsByIdModel,
    updateSettingsModel,
    deleteSettingsModel,
  } from '../models/config.model.js';
  
  export const createConfig = async (req, res) => {
    try {
      const result = await createSettingsModel(req.body);
      return res.status(201).json({ id: result.insertId, message: 'Configuracion creado exitosamente' });
    } catch (error) {
      return res.status(500).json({ message: 'Error al crear configuracion', error });
    }
  };
  
  export const getAllConfigs = async (_req, res) => {
    try {
      const services = await getAllSettingsModel();
      return res.status(200).json(services);
    } catch (error) {
      return res.status(500).json({ message: 'Error al obtener configuracion', error });
    }
  };
  
  export const getConfigById = async (req, res) => {
    try {
      const service = await getSettingsByIdModel(req.params.id);
      if (!service) return res.status(404).json({ message: 'Configuracion no encontrado' });
      return res.status(200).json(service);
    } catch (error) {
      return res.status(500).json({ message: 'Error al obtener configuracion', error });
    }
  };
  
  export const updateConfig = async (req, res) => {
    try {
      const result = await updateSettingsModel(req.params.id, req.body);
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Configuracion no encontrado' });
      return res.status(200).json({ message: 'Configuracion actualizado exitosamente' });
    } catch (error) {
      return res.status(500).json({ message: 'Error al actualizar configuracion', error });
    }
  };
  
  export const deleteConfig = async (req, res) => {
    try {
      const result = await deleteSettingsModel(req.params.id);
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Configuracion no encontrado' });
      return res.status(200).json({ message: 'Configuracion eliminada exitosamente' });
    } catch (error) {
      return res.status(500).json({ message: 'Error al eliminar configuracion', error });
    }
  };
  