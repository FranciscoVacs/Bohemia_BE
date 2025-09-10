import type { Purchase } from "../entities/purchase.entity.js";
import { BaseController } from "./base.controller.js";
import type { IModel } from "../interfaces/model.interface.js";
import { TicketTypeController } from "./ticketType.controller.js";
import type { Request, Response, NextFunction } from "express";
import type { IPurchaseModel } from "../interfaces/purchase.interface.js";
import { PDFGenerator } from "../services/pdfGenerator.js";
import type { Ticket } from "../entities/ticket.entity.js";
import { throwError } from "../shared/errors/ErrorUtils.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";


export class PurchaseController extends BaseController<Purchase> {
  constructor(protected model: IPurchaseModel<Purchase>) {
    super(model);
  }

  create = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { ticketTypeId, ticketQuantity, userId } = req.body;
    const item = await this.model.createProtocol(
      ticketTypeId,
      ticketQuantity,
      userId,
    );
    const purchaseData = {
      id: item?.id,
      ticketNumbers: item?.ticketNumbers,
      paymentStatus: item?.paymentStatus,
      discountApplied: item?.discountApplied,
      totalPrice: item?.totalPrice,
      userId: item?.user.id,
      ticketTypeId: item?.ticketType.id,
    };

    return res
      .status(201)
      .send({ message: "Item created", data: purchaseData });
  });

  getTickets = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const item = await this.model.getById(id);
    return res.status(200).send(item);
  });

  getById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const {purchaseId, ticketId} = req.params;
    const item = await this.model.getById(purchaseId);
    
    // Verificar que el usuario es propietario de la compra o es admin
    if (!req.user?.isAdmin && item?.user.id !== req.user?.id) {
      throwError.custom("Access denied: You can only download your own tickets", 403);
      return;
    }
    
    const parsedId = Number.parseInt(ticketId);
    let pdfBuffer: Buffer | undefined;
    for (const ticket of item?.ticket || []) {
      if (ticket.id === parsedId) {
        const ActualTicket:Ticket = ticket;
        pdfBuffer = await PDFGenerator.generateTicketPDF(
          ActualTicket,
          item?.ticketType,
          item?.ticketType.event,
          item,
          item?.ticketType.event.location,
        );
      }
    }
    if (pdfBuffer) {
      res.contentType("application/pdf");
      res.set('Content-Disposition', 'attachment; filename=ticket.pdf');
      res.send(pdfBuffer);
    } else {
      throwError.notFound("Ticket not found");
    }
  });
}
