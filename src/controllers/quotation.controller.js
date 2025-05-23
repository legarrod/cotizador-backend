import {
  createQuotationModel,
  getAllQuotationsModel,
  getQuotationByIdModel,
  updateQuotationModel,
  deleteQuotationModel
} from '../models/quotation.model.js';
import { getItemByIdModel } from '../models/service.model.js';
import { generatePdf, sendEmail } from '../utils/pdfAndMail.js';

export const createQuotation = async (req, res) => {
  try {
    const { client_id, advisor_id, items, email, notes } = req.body;

    let totalPrice = 0;
    const serviceDetails = [];

    for (const item of items) {
      const service = await getItemByIdModel(item.id);
      if (!service) return res.status(404).json({ message: `Servicio ${item.service_id} no encontrado` });
      serviceDetails.push({ ...service, quantity: item.quantity });
      totalPrice += service.price * item.quantity;
    }

    const result = await createQuotationModel({
      client_id,
      advisor_id,
      items: serviceDetails,
      totalPrice,
      email,
      notes
    });

    return res.status(201).json({ id: result.insertId, message: 'Cotización creada exitosamente' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear cotización', error });
  }
};


export const getAllQuotations = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  try {
    const quotations = await getAllQuotationsModel(Number(limit), Number(offset));
    return res.status(200).json(quotations);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener cotizaciones', error });
  }
};

export const getQuotationById = async (req, res) => {
  try {
    const quotation = await getQuotationByIdModel(req.params.id);
    if (!quotation) return res.status(404).json({ message: 'Cotización no encontrada' });
    return res.status(200).json(quotation);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener cotización', error });
  }
};

export const updateQuotation = async (req, res) => {
  try {
    const { client_id, advisor_id, items, email, notes } = req.body;

    let totalPrice = 0;
    const serviceDetails = [];

    for (const item of items) {
      const service = await getItemByIdModel(item.id);
      if (!service) return res.status(404).json({ message: `Servicio ${item.service_id} no encontrado` });
      serviceDetails.push({ ...service, quantity: item.quantity });
      totalPrice += service.price * item.quantity;
    }

    const result = await updateQuotationModel(req.params.id, {
      client_id,
      advisor_id,
      items: serviceDetails,
      totalPrice,
      email,
      notes
    });

    if (result.affectedRows === 0) return res.status(404).json({ message: 'Cotización no encontrada' });
    return res.status(200).json({ message: 'Cotización actualizada exitosamente' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar cotización', error });
  }
};


export const deleteQuotation = async (req, res) => {
  try {
    const result = await deleteQuotationModel(req.params.id);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Cotización no encontrada' });
    return res.status(200).json({ message: 'Cotización eliminada exitosamente' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar cotización', error });
  }
};

export const exportQuotationPdf = async (req, res) => {
  try {
    const quotation = await getQuotationByIdModel(req.params.id);
    if (!quotation) return res.status(404).json({ message: 'Cotización no encontrada' });

    const filePath = await generatePdf(quotation);
    res.download(filePath, `cotizacion_${quotation.id}.pdf`);
  } catch (error) {
    res.status(500).json({ message: 'Error al generar PDF', error });
  }
};

export const sendQuotationEmail = async (req, res) => {
  try {
    const quotation = await getQuotationByIdModel(req.params.id);
    if (!quotation) return res.status(404).json({ message: 'Cotización no encontrada' });

    const filePath = await generatePdf(quotation);
    await sendEmail(quotation.email, filePath);
    return res.status(200).json({ message: 'Correo enviado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al enviar cotización', error });
  }
};
