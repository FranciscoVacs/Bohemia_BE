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
    // Check if all required parameters are defined
    if (!ticket || !ticket_type || !event || !location) {
      throw new Error('Missing required ticket information');
    }

    // Create an instance of PDFGenerator and call the instance method
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

      // Generate QR Code using the ticket's existing qr_code
      QRCode.toDataURL(ticket.qr_code, async (err, qrCodeUrl) => {
        if (err) {
          reject(err);
          return;
        }

        // Set font
        doc.font('Helvetica');

        // Header
        doc.fontSize(16)
           .text(event.event_name, { align: 'center', underline: true });
        
        doc.moveDown();

        // Event Date and Time
        doc.fontSize(12)
           .text(format(event.begin_datetime, 'dd/MM/yy HH:mm'), { align: 'center' });

        // QR Code
        doc.image(qrCodeUrl, doc.page.width / 2 - 100, doc.y, {
          width: 200,
          height: 200,
          align: 'center'
        });

        doc.moveDown(2);

        // Ticket Details
        doc.fontSize(10)
           .text(`ENTRADA - ${ticket_type.ticketType_name.toUpperCase()} - ${ticket_type.price}`, { align: 'center' })
           .text(`${ticket.qr_code}`, { align: 'center' })
           .text(`${format(event.begin_datetime, 'dd/MM/yy HH:mm')}`, { align: 'center' })
           .text(`${location.location_name.toUpperCase()}`, { align: 'center' });

        doc.end();
      });
    });
  }
}