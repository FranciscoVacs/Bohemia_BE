import type { Request, Response, NextFunction } from "express";
import type { EntityManager } from "@mikro-orm/mysql";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { assertResourceExists } from "../shared/errors/ErrorUtils.js";
import { Event } from "../entities/event.entity.js";
import { Purchase, PaymentStatus } from "../entities/purchase.entity.js";
import { TicketType } from "../entities/ticketType.entity.js";

/**
 * Interfaces para el response de estadísticas
 */
interface TicketTypeStats {
  id: number;
  name: string;
  sold: number;
  capacity: number;
  percentageSold: number;
  revenue: number;
  price: number;
}

interface RecentTransaction {
  id: number;
  userName: string;
  userInitials: string;
  ticketTypeName: string;
  quantity: number;
  totalPrice: number;
  createdAt: string;
}

interface LastSale {
  userName: string;
  ticketTypeName: string;
  timeAgo: string;
  createdAt: string;
}

interface EventStatsResponse {
  eventId: number;
  eventName: string;
  eventStatus: 'upcoming' | 'active' | 'past';
  saleStatus: 'active' | 'inactive';
  lastUpdated: string;
  summary: {
    totalTicketsSold: number;
    totalCapacity: number;
    percentageSold: number;
    totalRevenue: number;
    averageTicketPrice: number;
  };
  byTicketType: TicketTypeStats[];
  recentTransactions: RecentTransaction[];
  lastSale: LastSale | null;
}

/**
 * Controlador para estadísticas de eventos
 * Requiere acceso directo al EntityManager para queries complejas
 */
export class EventStatsController {
  constructor(private getEntityManager: () => EntityManager) { }

  /**
   * Obtiene estadísticas completas de un evento
   * GET /api/event/:eventId/stats
   */
  getStats = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const eventId = Number.parseInt(req.params.eventId);
    const limit = Number.parseInt(req.query.limit as string) || 10;

    const em = this.getEntityManager();

    // Obtener evento con ticketTypes
    const event = await em.findOne(Event, eventId, {
      populate: ['ticketType', 'location', 'location.city']
    });

    assertResourceExists(event, `Event with id ${eventId}`);

    // Obtener todas las compras aprobadas para este evento
    const purchases = await em.find(Purchase, {
      ticketType: { event: eventId },
      paymentStatus: PaymentStatus.APPROVED
    }, {
      populate: ['user', 'ticketType'],
      orderBy: { createdAt: 'DESC' }
    });

    // Calcular estadísticas por tipo de ticket
    const ticketTypes = event!.ticketType.getItems();
    const byTicketType: TicketTypeStats[] = ticketTypes.map(tt => {
      const sold = tt.maxQuantity - tt.availableTickets;
      const revenue = purchases
        .filter(p => p.ticketType.id === tt.id)
        .reduce((sum, p) => sum + p.totalPrice, 0);

      return {
        id: tt.id,
        name: tt.ticketTypeName,
        sold,
        capacity: tt.maxQuantity,
        percentageSold: tt.maxQuantity > 0 ? Math.round((sold / tt.maxQuantity) * 100) : 0,
        revenue,
        price: tt.price
      };
    });

    // Calcular resumen total
    const totalCapacity = byTicketType.reduce((sum, tt) => sum + tt.capacity, 0);
    const totalTicketsSold = byTicketType.reduce((sum, tt) => sum + tt.sold, 0);
    const totalRevenue = byTicketType.reduce((sum, tt) => sum + tt.revenue, 0);
    const percentageSold = totalCapacity > 0 ? Math.round((totalTicketsSold / totalCapacity) * 100) : 0;
    const averageTicketPrice = totalTicketsSold > 0 ? Math.round(totalRevenue / totalTicketsSold) : 0;

    // Obtener transacciones recientes (limitadas)
    const recentPurchases = purchases.slice(0, limit);
    const recentTransactions: RecentTransaction[] = recentPurchases.map(p => ({
      id: p.id,
      userName: `${p.user.userName} ${p.user.userSurname}`,
      userInitials: this.getInitials(p.user.userName, p.user.userSurname),
      ticketTypeName: p.ticketType.ticketTypeName,
      quantity: p.ticketNumbers,
      totalPrice: p.totalPrice,
      createdAt: p.createdAt.toISOString()
    }));

    // Última venta
    let lastSale: LastSale | null = null;
    if (purchases.length > 0) {
      const lastPurchase = purchases[0];
      lastSale = {
        userName: `${lastPurchase.user.userName} ${lastPurchase.user.userSurname}`,
        ticketTypeName: lastPurchase.ticketType.ticketTypeName,
        timeAgo: this.getTimeAgo(lastPurchase.createdAt),
        createdAt: lastPurchase.createdAt.toISOString()
      };
    }

    // Determinar estado del evento
    const now = new Date();
    const beginDate = new Date(event!.beginDatetime);
    const finishDate = new Date(event!.finishDatetime);

    let eventStatus: 'upcoming' | 'active' | 'past';
    if (now < beginDate) {
      eventStatus = 'upcoming';
    } else if (now >= beginDate && now <= finishDate) {
      eventStatus = 'active';
    } else {
      eventStatus = 'past';
    }

    // Determinar si hay venta activa
    const saleStatus = ticketTypes.some(tt => tt.isSaleActive()) ? 'active' : 'inactive';

    const response: EventStatsResponse = {
      eventId: event!.id,
      eventName: event!.eventName,
      eventStatus,
      saleStatus,
      lastUpdated: new Date().toISOString(),
      summary: {
        totalTicketsSold,
        totalCapacity,
        percentageSold,
        totalRevenue,
        averageTicketPrice
      },
      byTicketType,
      recentTransactions,
      lastSale
    };

    return res.status(200).send({
      message: "Estadísticas obtenidas exitosamente",
      data: response
    });
  });

  /**
   * Obtiene las iniciales de un nombre
   */
  private getInitials(firstName: string, lastName: string): string {
    const first = firstName?.charAt(0)?.toUpperCase() || '';
    const last = lastName?.charAt(0)?.toUpperCase() || '';
    return `${first}${last}`;
  }

  /**
   * Calcula tiempo relativo desde una fecha
   */
  private getTimeAgo(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 60) {
      return `Hace ${seconds}s`;
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `Hace ${minutes}m`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `Hace ${hours}h`;
    }

    const days = Math.floor(hours / 24);
    if (days < 30) {
      return `Hace ${days}d`;
    }

    const months = Math.floor(days / 30);
    return `Hace ${months} mes${months > 1 ? 'es' : ''}`;
  }
}
