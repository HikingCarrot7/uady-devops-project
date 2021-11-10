import { getMockReq, getMockRes } from '@jest-mock/express';
import express from 'express';
import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import { FlightTicket } from '../../entities/flight_ticket.entity';
import { FlightTicketService } from '../../services/flight_ticket/flight_ticket.service';
import { UserNotFoundException } from '../../services/user/user.exceptions';
import { invalidIdMsg, isNumericId } from '../../utils/validate_id';
import { RequestWithUserId } from '../types';
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
    const userId = 1;

    mockFlightTicketService.getUserFlightTickets.mockImplementation(
      async (userId) => {
        throw new UserNotFoundException(userId);
      }
    );

    const mockReq = getMockReq();
    const { res: mockRes } = getMockRes();

    mockReq.params.id = `${userId}`;

    await flightTicketRouter.getUserFlightTickets(mockReq, mockRes);

    expect(mockFlightTicketService.getUserFlightTickets).toHaveBeenCalledTimes(
      1
    );
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalled();
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
    const userId = 1;

    const reqBody = {
      flightId: 1,
      flightClassId: 1,
      passengers: 5,
    };

    const { flightId, flightClassId, ...providedFlightTicket } = reqBody;

    mockFlightTicketService.createFlightTicket.mockImplementation(
      (userId, flightId, flightClassId, passengers) => {
        return Promise.resolve({
          id: 10,
          ...providedFlightTicket,
        } as unknown as FlightTicket);
      }
    );

    const mockReq: RequestWithUserId = getMockReq();
    const { res: mockRes } = getMockRes();

    mockReq.body = reqBody;
    mockReq.userId = userId;

    await flightTicketRouter.createFlightTicket(mockReq, mockRes);

    expect(mockFlightTicketService.createFlightTicket).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      id: 10,
      ...providedFlightTicket,
    });
  });
});

describe('updateFlightTicket endpoint', () => {
  test('should return 200 http status code when ticket updated', async () => {
    const ticketId = 1;

    const reqBody = {
      flightClassId: 1,
      passengers: 10,
    };

    const { flightClassId, ...providedFlightTicket } = reqBody;

    mockFlightTicketService.updateFlightTicket.mockImplementation(
      (ticketId, flightClassId, providedFlightTicket) => {
        return Promise.resolve({ id: 1 } as FlightTicket);
      }
    );

    const mockReq = getMockReq();
    const { res: mockRes } = getMockRes();

    mockReq.params.id = `${ticketId}`;
    mockReq.body = reqBody;

    await flightTicketRouter.updateFlightTicket(mockReq, mockRes);

    expect(mockFlightTicketService.updateFlightTicket).toHaveBeenCalledTimes(1);
    expect(mockFlightTicketService.updateFlightTicket).toHaveBeenCalledWith(
      ticketId,
      undefined,
      undefined,
      flightClassId,
      providedFlightTicket
    );
    expect(mockRes.status).toBeCalledWith(200);
  });
});

describe('deleteFlightTicket endpoint', () => {
  test('should return 200 http status when ticket deleted', async () => {
    const ticketId = 1;

    mockFlightTicketService.deleteFlightTicket.mockImplementation(
      (ticketId) => {
        return Promise.resolve({ id: ticketId } as FlightTicket);
      }
    );

    const mockReq = getMockReq();
    const { res: mockRes } = getMockRes();

    mockReq.params.id = `${ticketId}`;

    await flightTicketRouter.deleteFlightTicket(mockReq, mockRes);

    expect(mockFlightTicketService.deleteFlightTicket).toHaveBeenCalledTimes(1);
    expect(mockFlightTicketService.deleteFlightTicket).toHaveBeenCalledWith(
      ticketId
    );
    expect(mockRes.status).toBeCalledWith(200);
  });
});
