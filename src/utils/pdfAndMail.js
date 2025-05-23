import fs from 'fs';
import PDFDocument from 'pdfkit';
import path from 'path';

export const generatePdf = async (quotation) => {
  const doc = new PDFDocument();
  const filename = `cotizacion_${quotation.id}.pdf`;
  const filePath = path.resolve(`./temp/${filename}`);

  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  // Logo
  const logoPath = path.resolve('./assets/logo.png');
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 50, 50, { width: 100 });
  }

  // Información de contacto
  doc.fontSize(12)
    .text('Tu Empresa S.A.S.', 400, 50)
    .text('contacto@tuempresa.com')
    .text('+57 300 000 0000')
    .text('www.tuempresa.com');

  doc.moveDown(2);

  // Datos del cliente
  doc.fontSize(14).text(`Cotización para: ${quotation.client}`);
  doc.fontSize(12).text(`Correo: ${quotation.email || 'No registrado'}`);
  doc.text(`Fecha: ${new Date(quotation.createdAt).toLocaleDateString()}`);
  doc.moveDown();

  // Tabla de servicios
  doc.fontSize(12).text('Servicios:', { underline: true });

  quotation.services.forEach((item, index) => {
    const { service, quantity } = item;
    doc.text(`${index + 1}. ${service.name} x ${quantity} - $${(service.price * quantity).toFixed(2)}`);
  });

  doc.moveDown();
  doc.fontSize(14).text(`Total: $${quotation.totalPrice.toFixed(2)}`, { bold: true });
  doc.moveDown();

  if (quotation.note) {
    doc.fontSize(12).text('Nota final:', { underline: true });
    doc.text(quotation.note);
  }

  doc.end();

  // Esperar a que el archivo esté listo
  await new Promise((resolve) => stream.on('finish', resolve));
  return filePath;
};

export const sendEmail = async (to, attachmentPath) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'tucorreo@gmail.com',
        pass: 'tu-app-password'
      }
    });
  
    const info = await transporter.sendMail({
      from: '"Tu Empresa" <tucorreo@gmail.com>',
      to,
      subject: 'Cotización personalizada',
      text: 'Adjunto encontrarás la cotización solicitada.',
      attachments: [
        {
          filename: attachmentPath.split('/').pop(),
          path: attachmentPath
        }
      ]
    });
  
    return info;
  };