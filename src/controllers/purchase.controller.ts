import type { Purchase } from "../entities/purchase.entity.js";
import { BaseController } from "./base.controller.js";
import type { Request, Response, NextFunction } from "express";
import type { IPurchaseModel } from "../interfaces/purchase.interface.js";
import { PDFGenerator } from "../services/pdfGenerator.js";
import type { Ticket } from "../entities/ticket.entity.js";
import { throwError } from "../shared/errors/ErrorUtils.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { mapMPStatus } from "../services/paymentStatusMapper.js";
import { Console } from "console";

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
        id: purchase.id,
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
    return res.status(200).send({
      message: "Purchase tickets retrieved successfully",
      data: item
    });
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
    let index = 1;
    for (const ticket of item?.ticket || []) {
      if (ticket.id === parsedId) {
        const ActualTicket: Ticket = ticket;
        pdfBuffer = await PDFGenerator.generateTicketPDF(
          ActualTicket,
          index, // Pasamos el índice inferido dinámicamente
          item?.ticketType,
          item?.ticketType.event,
          item,
          item?.ticketType.event.location,
        );
        break;
      }
      index++;
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
    const { id } = req.body;

    // Validate required fields
    if (!id) {
      throwError.badRequest("id is required");
      return;
    }

    try {
      // Initialize MercadoPago client with the new SDK
      const client = new MercadoPagoConfig({
        accessToken: process.env.MP_TEST_ACCESS_TOKEN!,
      });

      const preferenceClient = new Preference(client);
      const purchase = await this.model.getById(id);
      // Create preference

      console.log("PURCHASEID", id);
      const preferenceResponse = await preferenceClient.create({
        body: {
          items: [
            {
              id: id,
              title: purchase!.ticketType.ticketTypeName,
              quantity: purchase!.ticketNumbers,
              unit_price: purchase!.totalPrice / purchase!.ticketNumbers,
            }
          ],
          back_urls: {
            success: `${process.env.FRONTEND_URL}/redirect`,
            failure: `${process.env.FRONTEND_URL}/failure`,
            pending: `${process.env.FRONTEND_URL}/pending`
          },
          auto_return: 'approved',
          external_reference: id.toString(),
          notification_url: `${process.env.BACKEND_URL}/api/purchase/payments/webhook`
        }
      });
      return res.status(201).json({
        init_point: preferenceResponse.init_point
      });
    } catch (error: any) {
      console.error("MercadoPago error:", error);
      throwError.badRequest(`MercadoPago error: ${error.message}`);
    }
  })
  handlePaymentWebhook = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    let paymentId: string | null = null;

    if (req.body?.data?.id) {
      paymentId = req.body.data.id;
    }

    if (req.body?.topic === "payment" && req.body.resource)
      return req.body.resource;

    console.log("PAYMENTID", paymentId);
    if (!paymentId || isNaN(Number(paymentId))) {
      console.log("Not a payment notification, ignoring");
      return res.sendStatus(200);
    }

    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_TEST_ACCESS_TOKEN}`
        }
      }
    );

    const payment = await response.json();

    //  console.log("STATUS:", payment.status);
    //  console.log("STATUS DETAIL:", payment.status_detail);
    //  console.log("purchase id:", payment.external_reference);
    const status = mapMPStatus(payment.status);
    console.log("PAYMENT", payment);
    console.log("REFERENCE:", payment.external_reference);
    console.log("STATUS", status);
    this.model.updatePaymentStatus(payment.external_reference, status);
    res.sendStatus(200);
  }

  )

  getPaymentFromMP = async function getPaymentFromMP(paymentId: string) {
    const res = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_TEST_ACCESS_TOKEN}`
        }
      }
    );
    if (!res.ok) {
      throw new Error(`MP error: ${res.status}`);
    }

    return await res.json();
  }


  verifyPurchaseId = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { paymentId } = req.params;
    if (!paymentId) {
      return res.status(400).json({ error: 'Missing payment_id' });
    }

    const payment = await this.getPaymentFromMP(paymentId);
    console.log("MP PAYMENT:", payment);
    if (payment.status !== 'approved') return res.status(400).json({ error: 'Payment not approved' });

    const purchaseId = payment.external_reference;
    const purchase = await this.model.getById(purchaseId);

    if (!purchase) return res.status(404).json({ error: 'Purchase not found' });

    res.json({
      success: true,
      purchaseId,
    });
  })

}
