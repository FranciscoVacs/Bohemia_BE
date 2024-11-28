import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import type { Ticket } from '../entities/ticket.entity';
import type { TicketType } from '../entities/ticketType.entity';
import type{ Event } from '../entities/event.entity';
import type{ Location } from '../entities/location.entity';

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
      // Existing PDF generation logic remains the same
      const doc = new PDFDocument();
      const buffers: Buffer[] = [];

      doc.on('data', (buffer) => buffers.push(buffer));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      QRCode.toDataURL(`Ticket ID: ${ticket.id}`, async (err, qrCodeUrl) => {
        if (err) {
          reject(err);
          return;
        }

        doc.fontSize(25).text('Ticket Details', { align: 'center' });
        doc.moveDown();

        doc.fontSize(12)
          .text(`Ticket ID: ${ticket.id}`)
          .text(`Event: ${event.event_name}`)
          .text(`Location: ${location.address}`)
          .text(`Date: ${event.begin_datetime}`)
          .text(`Ticket Type: ${ticket_type.ticketType_name}`);

        doc.image(qrCodeUrl, {
          fit: [200, 200],
          align: 'center',
          valign: 'center'
        });

        doc.end();
      });
    });
  }
}