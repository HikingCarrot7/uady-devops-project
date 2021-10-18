import { getMockReq, getMockRes } from '@jest-mock/express';
import express from 'express';
import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import { FlightTicket } from '../../entities/flight_ticket.entity';
import { FlightTicketService } from '../../services/flight_ticket/flight_ticket.service';
import { invalidIdMsg, isNumericId } from '../../utils/validate_id';
import { FlightTicketRouter } from './flight_ticket.router';

let mockFlightTicketService: MockProxy<FlightTicketService>;
let flightTicketRouter: any;

beforeAll(() => {
  mockFlightTicketService = mock<FlightTicketService>();
  flightTicketRouter = FlightTicketRouter(
    express.Router(),
    mockFlightTicketService
  );
});

afterEach(() => {
  mockReset(mockFlightTicketService);
});

describe('getUserFlightTickets endpoint', () => {
  test('get user flight tickets should return 200 http status code if user exists', async () => {
    mockFlightTicketService.getUserFlightTickets.mockImplementation(
      async (userId) => {
        return Promise.resolve([]);
      }
    );

    const mockReq = getMockReq();
    const { res: mockRes } = getMockRes();

    await flightTicketRouter.getUserFlightTickets(mockReq, mockRes);

    expect(mockFlightTicketService.getUserFlightTickets).toHaveBeenCalledTimes(
      1
    );

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith([]);
  });

  test("get user flight tickets should return 404 http status code if user doesn't exists", async () => {
    const userId = '1';

    mockFlightTicketService.getUserFlightTickets.mockImplementation(
      async (userId) => {
        return Promise.resolve(null as unknown as FlightTicket[]);
      }
    );

    const mockReq = getMockReq();
    const { res: mockRes } = getMockRes();

    mockReq.params.id = userId;

    await flightTicketRouter.getUserFlightTickets(mockReq, mockRes);

    expect(mockFlightTicketService.getUserFlightTickets).toHaveBeenCalledTimes(
      1
    );
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: `No existe el usuario con id: ${userId}`,
    });
  });
});

describe('getFlightTicketById endpoint', () => {
  test('should return 200 http status code if tickets exists', async () => {
    const ticketId = '1';

    const ticket = {
      id: parseInt(ticketId),
    };

    mockFlightTicketService.getFlightTicketById.mockImplementation(
      async (ticketId) => {
        if (!isNumericId(ticketId)) {
          return Promise.reject(invalidIdMsg(ticketId));
        }

        if (ticketId == ticket.id)
          return Promise.resolve(ticket as FlightTicket);

        return Promise.resolve(null as unknown as FlightTicket);
      }
    );

    const mockReq = getMockReq();
    const { res: mockRes } = getMockRes();

    mockReq.params.id = ticketId;

    await flightTicketRouter.getFlightTicketById(mockReq, mockRes);

    expect(mockFlightTicketService.getFlightTicketById).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(200);
    expect(mockRes.json).toBeCalledWith(ticket);
  });
});

describe('createFlightTicket endpoint', () => {
  test('should return 201 http status code when new ticket created', async () => {
    const reqBody = {
      userId: 1,
      flightId: 1,
      flightClassId: 1,
      passengers: 5,
    };

    mockFlightTicketService.createFlightTicket.mockImplementation(
      (userId, flightId, flightClassId, passengers) => {
        return Promise.resolve({
          id: 10,
          ...reqBody,
        } as unknown as FlightTicket);
      }
    );

    const mockReq = getMockReq();
    const { res: mockRes } = getMockRes();

    mockReq.body = reqBody;

    await flightTicketRouter.createFlightTicket(mockReq, mockRes);

    expect(mockFlightTicketService.createFlightTicket).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({ id: 10, ...reqBody });
  });
});

describe('updateFlightTicket endpoint', () => {
  test('should return 200 http status code when ticket updated', async () => {
    const ticketId = '1';

    const reqBody = {
      passengers: 10,
    };

    mockFlightTicketService.updateFlightTicket.mockImplementation(
      (ticketId, newFlightTicket) => {
        return Promise.resolve({} as FlightTicket);
      }
    );

    const mockReq = getMockReq();
    const { res: mockRes } = getMockRes();

    mockReq.params.id = ticketId;
    mockReq.body = reqBody;

    await flightTicketRouter.updateFlightTicket(mockReq, mockRes);

    expect(mockFlightTicketService.updateFlightTicket).toHaveBeenCalledTimes(1);
    expect(mockFlightTicketService.updateFlightTicket).toHaveBeenCalledWith(
      ticketId,
      reqBody
    );
    expect(mockRes.status).toBeCalledWith(200);
  });
});

describe('deleteFlightTicket endpoint', () => {
  test('should return 200 http status when ticket deleted', async () => {
    const ticketId = '1';

    mockFlightTicketService.deleteFlightTicket.mockImplementation(
      (ticketId) => {
        return Promise.resolve({} as FlightTicket);
      }
    );

    const mockReq = getMockReq();
    const { res: mockRes } = getMockRes();

    mockReq.params.id = ticketId;
  
    await flightTicketRouter.deleteFlightTicket(mockReq, mockRes);

    expect(mockFlightTicketService.deleteFlightTicket).toHaveBeenCalledTimes(1);
    expect(mockFlightTicketService.deleteFlightTicket).toHaveBeenCalledWith(
      ticketId
    );
    expect(mockRes.status).toBeCalledWith(200);
  });
});
