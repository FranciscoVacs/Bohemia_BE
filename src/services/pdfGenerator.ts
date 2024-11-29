import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import type { Ticket } from '../entities/ticket.entity';
import type { TicketType } from '../entities/ticketType.entity';
import type { Event } from '../entities/event.entity';
import type { Location } from '../entities/location.entity';
import { format } from 'date-fns';
import type { Purchase } from '../entities/purchase.entity.js';

export class PDFGenerator {
  static async generateTicketPDF(
    ticket: Ticket | undefined, 
    ticket_type: TicketType | undefined, 
    event: Event | undefined,
    purchase: Purchase | undefined, 
    location: Location | undefined
  ): Promise<Buffer> {
    // Check if all required parameters are defined
    if (!ticket || !ticket_type || !event || !purchase || !location) {
      throw new Error('Missing required ticket information');
    }

    // Create an instance of PDFGenerator and call the instance method
    const pdfGenerator = new PDFGenerator();
    return await pdfGenerator.generateTicketPDF(
      ticket, 
      ticket_type, 
      event,
      purchase, 
      location
    );
  }

  async generateTicketPDF(
    ticket: Ticket,
    ticket_type: TicketType,
    event: Event,
    purchase: Purchase,
    location: Location
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: [706, 252], 
        margin: 20,
      });
      const buffers: Buffer[] = [];

      doc.on('data', (buffer) => buffers.push(buffer));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      // Generate QR Code using the ticket's existing qr_code
      QRCode.toDataURL(ticket.qr_code, async (err, qrCodeUrl) => {
        if (err) {
          reject(err);
          return;
        }

        // Set font
        doc.font('Helvetica');

        

        doc.fontSize(12)
          .text(`Ticket: ${ticket.number_in_purchase} de ${purchase.ticket_numbers}`,{ align: 'right' });

        doc.moveDown(0.5);

        // Header
        doc.fontSize(20)
        doc.font('Helvetica-Bold')
           .text(event.event_name, { align: 'center', underline: true });
        
        doc.moveDown();

        doc.fontSize(13)
        doc.font('Helvetica-Bold')
           .text('Fecha y Hora', { align: 'center'});

        doc.moveDown(0.5);
        doc.fontSize(12)
           .text(format(event.begin_datetime, 'dd/MM/yy HH:mm'), { align: 'center' });

        doc.moveDown();

        doc.fontSize(10)
           .text(`${location.location_name}`, { align: 'center' })
           .text(`${location.address}`, { align: 'center' })
           .text(`ENTRADA - ${ticket_type.ticketType_name.toUpperCase()} - $${ticket_type.price}`, { align: 'center' });
           


        // QR Code
       // Coordenadas más altas para evitar el salto de página
        const qrCodeX = 50; // Posición X de la imagen
        const qrCodeY = 90; // Posición Y más alta para la imagen

        // QR Code
        doc.image(qrCodeUrl, qrCodeX, qrCodeY, { fit: [100, 100] }); // Imagen QR posicionada más arriba

        doc.moveDown(0.5);
        doc.text(ticket.qr_code,65,50, { align: 'left', width: 100, });
            

        doc.end();
      });
    });
  }
}