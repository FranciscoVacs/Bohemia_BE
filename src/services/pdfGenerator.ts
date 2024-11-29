import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import type { Ticket } from '../entities/ticket.entity';
import type { TicketType } from '../entities/ticketType.entity';
import type { Event } from '../entities/event.entity';
import type { Location } from '../entities/location.entity';
import { format } from 'date-fns';

export class PDFGenerator {
  static async generateTicketPDF(
    ticket: Ticket | undefined, 
    ticket_type: TicketType | undefined, 
    event: Event | undefined, 
    location: Location | undefined
  ): Promise<Buffer> {
    if (!ticket || !ticket_type || !event || !location) {
      throw new Error('Missing required ticket information');
    }

    const pdfGenerator = new PDFGenerator();
    return await pdfGenerator.generateTicketPDF(
      ticket, 
      ticket_type, 
      event, 
      location
    );
  }

  async generateTicketPDF(
    ticket: Ticket,
    ticket_type: TicketType,
    event: Event,
    location: Location
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: [595.28, 841.89], // A4 size
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });
      const buffers: Buffer[] = [];

      doc.on('data', (buffer) => buffers.push(buffer));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      QRCode.toDataURL(ticket.qr_code, async (err, qrCodeUrl) => {
        if (err) {
          reject(err);
          return;
        }

        doc.font('Helvetica-Bold');

        // First line with event name and date
        doc.fontSize(14)
           .text('1717 17', { align: 'left' });

        doc.fontSize(12)
           .text(`${event.event_name.toUpperCase()} - ${format(event.begin_datetime, 'DD DE MMMM').toUpperCase()}!`, { align: 'left' });

        // QR Code
        doc.image(qrCodeUrl, doc.page.width - 200, 50, {
          width: 150,
          height: 150,
          align: 'right'
        });

        doc.moveDown();

        // Ticket Details
        doc.font('Helvetica')
           .fontSize(10)
           .text(`${ticket.qr_code}`, { align: 'left' })
           .text(`${format(event.begin_datetime, 'DD/MM/YY')} ${format(event.begin_datetime, 'HH:mm')}`, { align: 'left' })
           .text(`${location.location_name.toUpperCase()}`, { align: 'left' });

        doc.moveDown();

        // Ticket Type and Price
        doc.font('Helvetica-Bold')
           .fontSize(10)
           .text(`ENTRADA - ${ticket_type.ticketType_name.toUpperCase()} ${ticket_type.price} - ${ticket_type.price}.00 + SC 0`, { align: 'left' });

        // Additional details
        doc.font('Helvetica')
           .fontSize(8)
           .text(`${format(new Date(), 'DD/MM/YY')} ${format(new Date(), 'HH:mm')}`, { align: 'left' })
           .text('MIRKO_ADM', { align: 'left' });

        doc.end();
      });
    });
  }
}