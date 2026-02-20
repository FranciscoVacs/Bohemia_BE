import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import type { Ticket } from '../entities/ticket.entity';
import type { TicketType } from '../entities/ticketType.entity';
import type { Event } from '../entities/event.entity';
import type { Location } from '../entities/location.entity';
import { format } from 'date-fns';
import type { Purchase } from '../entities/purchase.entity.js';
import { BadRequestError } from '../shared/errors/AppError.js';

export class PDFGenerator {
  static async generateTicketPDF(
    ticket: Ticket | undefined,
    ticketNumber: number | undefined,
    ticket_type: TicketType | undefined,
    event: Event | undefined,
    purchase: Purchase | undefined,
    location: Location | undefined
  ): Promise<Buffer> {
    // Check if all required parameters are defined
    if (!ticket || !ticket_type || !event || !purchase || !location) {
      throw new BadRequestError('Missing required ticket information');
    }

    // Create an instance of PDFGenerator and call the instance method
    const pdfGenerator = new PDFGenerator();
    return await pdfGenerator.generateTicketPDF(
      ticket,
      ticketNumber!,
      ticket_type,
      event,
      purchase,
      location
    );
  }

  async generateTicketPDF(
    ticket: Ticket,
    ticketNumber: number,
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

      // Generate QR Code using the ticket's existing qrCode
      QRCode.toDataURL(ticket.qrCode, async (err, qrCodeUrl) => {
        if (err) {
          reject(err);
          return;
        }

        // --- TICKET LAYOUT & DESIGN --- //

        // Brand Colors
        const textColor = '#000000';
        const subduedText = '#444444';

        // 1. Outer Border
        doc.rect(15, 15, 676, 202)
          .lineWidth(2)
          .strokeColor(textColor)
          .stroke();

        // 2. Dashed Tear-off line
        doc.moveTo(520, 15)
          .lineTo(520, 217)
          .lineWidth(1)
          .dash(5, { space: 5 })
          .strokeColor(textColor)
          .stroke();
        doc.undash(); // Reset dash for the rest

        // --- LEFT SECTION: EVENT DETAILS --- //

        // Event Name
        doc.font('Helvetica-Bold')
          .fontSize(24)
          .fillColor(textColor)
          .text(event.eventName.toUpperCase(), 35, 35, {
            width: 460,
            align: 'left'
          });

        // Date and Time
        doc.font('Helvetica-Bold')
          .fontSize(10)
          .fillColor(subduedText)
          .text('FECHA Y HORA', 35, 100);
        doc.font('Helvetica-Bold')
          .fontSize(14)
          .fillColor(textColor)
          .text(`${format(event.beginDatetime, 'dd/MM/yyyy - HH:mm')} hs`, 35, 115);

        // Location
        doc.font('Helvetica-Bold')
          .fontSize(10)
          .fillColor(subduedText)
          .text('UBICACIÓN', 240, 100);
        doc.font('Helvetica-Bold')
          .fontSize(14)
          .fillColor(textColor)
          .text(location.locationName, 240, 115);
        doc.font('Helvetica')
          .fontSize(11)
          .fillColor(subduedText)
          .text(location.address, 240, 135, { width: 250 });

        // Ticket Type & Price
        doc.font('Helvetica-Bold')
          .fontSize(14)
          .fillColor(textColor)
          .text(`ENTRADA: ${ticket_type.ticketTypeName.toUpperCase()}`, 35, 165);
        doc.font('Helvetica')
          .fontSize(14)
          .text(`$${ticket_type.price}`, 35, 182);

        // --- RIGHT SECTION: TEAR-OFF (QR & INFO) --- //

        // Ticket Number
        doc.font('Helvetica-Bold')
          .fontSize(10)
          .fillColor(subduedText)
          .text('TICKET NO.', 540, 35);
        doc.font('Helvetica-Bold')
          .fontSize(14)
          .fillColor(textColor)
          .text(`${ticketNumber} / ${purchase.ticketNumbers}`, 540, 50);

        // QR Code
        doc.image(qrCodeUrl, 545, 75, { fit: [110, 110] });

        // QR Code alphanumeric string below
        doc.font('Helvetica')
          .fontSize(8)
          .fillColor(subduedText)
          .text(ticket.qrCode, 540, 195, { width: 120, align: 'center' });

        doc.end();
      });
    });
  }
}