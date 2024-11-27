import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import type { Ticket } from '../entities/ticket.entity';
import type { TicketType } from '../entities/ticketType.entity';
import type{ Event } from '../entities/event.entity';
import type{ Location } from '../entities/location.entity';

export class PDFGenerator {
  static generateTicketPDF(ticket: import("@mikro-orm/core").Collection<Ticket, object> | undefined, ticket_type: TicketType | undefined, event: Event | undefined, location: Location | undefined) {
    throw new Error("Method not implemented.");
  }
  async generateTicketPDF(
    ticket: Ticket, 
    ticket_type: TicketType, 
    event: Event, 
    location: Location
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      // Create a new PDF document
      const doc = new PDFDocument();
      const buffers: Buffer[] = [];

      // Collect the PDF data in buffers
      doc.on('data', (buffer) => buffers.push(buffer));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      // Generate QR Code
      QRCode.toDataURL(`Ticket ID: ${ticket.id}`, async (err, qrCodeUrl) => {
        if (err) {
          reject(err);
          return;
        }

        // PDF Content
        doc.fontSize(25).text('Ticket Details', { align: 'center' });
        doc.moveDown();

        // Ticket Information
        doc.fontSize(12)
          .text(`Ticket ID: ${ticket.id}`)
          .text(`Event: ${event.event_name}`)
          .text(`Location: ${location.address}`)
          .text(`Date: ${event.begin_datetime}`)
          .text(`Ticket Type: ${ticket_type.ticketType_name}`);

        // Add QR Code
        doc.image(qrCodeUrl, {
          fit: [200, 200],
          align: 'center',
          valign: 'center'
        });

        // Finalize PDF
        doc.end();
      });
    });
  }
}