import { getMockReq, getMockRes } from '@jest-mock/express';
import express from 'express';
import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import { Flight } from '../../entities/flight.entity';
import { FlightService } from '../../services/flight/flight.service';
import { invalidIdMsg, isNumericId } from '../../utils/validate_id';
import { FlightRouter } from './flight.router';

let mockFlightService: MockProxy<FlightService>;
let flightRouter: any;

beforeAll(() => {
  mockFlightService = mock<FlightService>();
  flightRouter = FlightRouter(express.Router(), mockFlightService);
});

afterEach(() => {
  mockReset(mockFlightService);
});

describe('getAllFlights endpoint', () => {
  test('get all flights should return 200 http status code', async () => {
    mockFlightService.getAllFlights.mockImplementation();

    const mockReq = getMockReq();
    const { res: mockRes } = getMockRes();

    await flightRouter.getAllFlights(mockReq, mockRes);

    expect(mockFlightService.getAllFlights).toHaveBeenCalledTimes(1);

    expect(mockRes.status).toHaveBeenCalledWith(200);
  });
});

describe('getFlightById endpoint', () => {
  test('should return 200 http status code if flight exists', async () => {
    const flightId = 1;

    const flight = {
      id: flightId,
    };

    mockFlightService.getFlightById.mockImplementation(async (flightId) => {
      if (!isNumericId(flightId)) {
        return Promise.reject(invalidIdMsg(flightId));
      }

      if (flightId == flight.id) return Promise.resolve(flight as Flight);

      return Promise.resolve(null as unknown as Flight);
    });

    const mockReq = getMockReq();
    const { res: mockRes } = getMockRes();

    mockReq.params.id = `${flightId}`;

    await flightRouter.getFlightById(mockReq, mockRes);

    expect(mockFlightService.getFlightById).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(flight);
  });
});

describe('createFlight endpoint', () => {
  test('should return 201 http status code when new flight created', async () => {
    const reqBody = {
      date: '2021-12-12',
      hour: '22:00',
      estimatedHours: 2,
      tickets: [{ id: 1 }],
      takeOffSite: { id: 1 },
      landingSite: { id: 1 },
    };

    mockFlightService.createFlight.mockImplementation(() => {
      return Promise.resolve({
        id: 1,
        ...reqBody,
      } as unknown as Flight);
    });

    const mockReq = getMockReq();
    const { res: mockRes } = getMockRes();

    mockReq.body = reqBody;

    await flightRouter.createFlight(mockReq, mockRes);

    expect(mockFlightService.createFlight).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(201);
  });
});

describe('updateFlight endpoint', () => {
  test('should return 200 http status code when flight updated', async () => {
    const flightId = 1;

    const reqBody = {
      hour: '10:00',
    };

    mockFlightService.updateFlight.mockImplementation(() => {
      return Promise.resolve({
        ...reqBody,
      } as Flight);
    });

    const mockReq = getMockReq();
    const { res: mockRes } = getMockRes();

    mockReq.params.id = `${flightId}`;
    mockReq.body = reqBody;

    await flightRouter.updateFlight(mockReq, mockRes);

    expect(mockFlightService.updateFlight).toHaveBeenCalledTimes(1);
    expect(mockFlightService.updateFlight).toHaveBeenCalledWith(
      flightId,
      reqBody
    );
    expect(mockRes.status).toBeCalledWith(200);
  });
});

describe('deleteFlight endpoint', () => {
  test('should return 200 http status when flight deleted', async () => {
    const flightId = 1;

    const flightDeleted = {
      id: 1,
    };

    mockFlightService.deleteFlightById.mockImplementation((flightId) => {
      return Promise.resolve(flightDeleted as Flight);
    });

    const mockReq = getMockReq();
    const { res: mockRes } = getMockRes();

    mockReq.params.id = `${flightId}`;

    await flightRouter.deleteFlightById(mockReq, mockRes);

    expect(mockFlightService.deleteFlightById).toHaveBeenCalledTimes(1);
    expect(mockFlightService.deleteFlightById).toHaveBeenCalledWith(flightId);
    expect(mockRes.status).toBeCalledWith(200);
  });
});
