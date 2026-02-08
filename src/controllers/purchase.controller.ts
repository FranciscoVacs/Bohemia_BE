import type { Purchase } from "../entities/purchase.entity.js";
import { BaseController } from "./base.controller.js";
import type { Request, Response, NextFunction } from "express";
import type { IPurchaseModel } from "../interfaces/purchase.interface.js";
import { PDFGenerator } from "../services/pdfGenerator.js";
import type { Ticket } from "../entities/ticket.entity.js";
import { throwError } from "../shared/errors/ErrorUtils.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { MercadoPagoConfig, Preference } from "mercadopago";

export class PurchaseController extends BaseController<Purchase> {
  constructor(protected model: IPurchaseModel<Purchase>) {
    super(model);
  }
  /**
   * Crea una compra y genera los tickets inmediatamente
   */
  createPurchase = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { ticketTypeId, ticketQuantity } = req.body;

    // Obtener userId del token JWT
    const userId = req.user?.id;
    if (!userId) {
      throwError.custom("User ID not found in token", 401);
      return;
    }

    const purchase = await this.model.createPurchase(
      ticketTypeId.toString(),
      ticketQuantity,
      userId.toString(),
    );

    return res.status(201).send({
      message: "Purchase created successfully",
      data: {
        purchaseId: purchase.id,
        ticketNumbers: purchase.ticketNumbers,
        totalPrice: purchase.totalPrice,
        paymentStatus: purchase.paymentStatus,
      }
    });
  });

  /**
   * Obtiene los tickets de una compra
   */
  getTickets = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const item = await this.model.getById(id);
    return res.status(200).send(item);
  });

  /**
   * Descarga el PDF de un ticket específico
   */
  getById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { purchaseId, ticketId } = req.params;
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
        const ActualTicket: Ticket = ticket;
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

  createPreference = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { ticketTypeName, ticketNumbers, price } = req.body;

    // Validate required fields
    if (!ticketTypeName || !ticketNumbers || !price) {
      throwError.badRequest("ticketTypeName, ticketNumbers, and price are required");
      return;
    }

    try {
      // Initialize MercadoPago client with the new SDK
      const client = new MercadoPagoConfig({
        accessToken: process.env.MP_TEST_ACCESS_TOKEN!,
      });

      const preferenceClient = new Preference(client);

      // Create preference
      const preferenceResponse = await preferenceClient.create({
        body: {
          items: [
            {
              id: "ticket-001",
              title: ticketTypeName,
              quantity: parseInt(ticketNumbers),
              unit_price: parseFloat(price),
            }
          ],
          back_urls: {
            success: `${process.env.FRONTEND_URL}/success`,
            failure: `${process.env.FRONTEND_URL}/failure`,
            pending: `${process.env.FRONTEND_URL}/pending`
          },
          auto_return: 'approved',
        }
      });
      return res.status(201).json({ 
        init_point: preferenceResponse.init_point 
      });
    } catch (error: any) {
      console.error("MercadoPago error:", error);
      throwError.badRequest(`MercadoPago error: ${error.message}`);
    }
  });}
