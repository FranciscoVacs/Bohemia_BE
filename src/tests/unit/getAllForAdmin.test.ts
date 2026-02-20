import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Request, Response, NextFunction } from 'express'
import { EventController } from '../../controllers/event.controller'
import * as dtoMapper from '../../dto/event.dto'

describe('EventController - getAllForAdmin', () => {
  let controller: EventController
  let mockModel: any
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction

  beforeEach(() => {
    mockModel = {
      getAll: vi.fn()
    }

    controller = new EventController(mockModel)

    req = {}

    res = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn()
    }

    next = vi.fn()
  })

  it('should return 200 with "No hay eventos" when empty array', async () => {
    mockModel.getAll.mockResolvedValue([])

    await controller.getAllForAdmin(
      req as Request,
      res as Response,
      next
    )

    expect(mockModel.getAll).toHaveBeenCalled()

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toHaveBeenCalledWith({
      message: "No hay eventos",
      data: [],
    })
  })

  it('should filter unpublished events and return only published DTOs', async () => {
    const fakeEvents = [
      { id: 1, isPublished: true },
      { id: 2, isPublished: false }
    ]

    mockModel.getAll.mockResolvedValue(fakeEvents)

    const mappedDTO = { id: 1, name: 'DTO Event' }

    vi.spyOn(dtoMapper, 'toAdminEventDTO')
      .mockReturnValue(mappedDTO as any)

    await controller.getAllForAdmin(
      req as Request,
      res as Response,
      next
    )

    expect(mockModel.getAll).toHaveBeenCalled()

    // Ensure DTO mapper only called once (only published event)
    expect(dtoMapper.toAdminEventDTO).toHaveBeenCalledTimes(1)
    expect(dtoMapper.toAdminEventDTO).toHaveBeenCalledWith(fakeEvents[0])

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toHaveBeenCalledWith({
      message: "Eventos obtenidos exitosamente",
      data: [mappedDTO],
    })
  })
})