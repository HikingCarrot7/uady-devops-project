import { getMockReq, getMockRes } from '@jest-mock/express';
import { Router } from 'express';
import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import { FlightClass } from '../../entities/flight_class.entity';
import { FlightClassService } from '../../services/flight_class/flight_class.service';
import { FlightClassRouter } from './flight_class.router';

let mockFlightClassService: MockProxy<FlightClassService>;
let flightClassRouter: any;

beforeAll(() => {
  mockFlightClassService = mock<FlightClassService>();
  flightClassRouter = FlightClassRouter(Router(), mockFlightClassService);
});

afterEach(() => {
  mockReset(mockFlightClassService);
});

describe('getAllFlightsClasses endpoint', () => {
  test('get all flights classes should return 200 http status code', async () => {
    mockFlightClassService.getAllFlightsClasses.mockImplementation();

    const mockReq = getMockReq();
    const { res: mockRes } = getMockRes();

    await flightClassRouter.getAllFlightsClasses(mockReq, mockRes);

    expect(mockFlightClassService.getAllFlightsClasses).toHaveBeenCalledTimes(
      1
    );

    expect(mockRes.status).toHaveBeenCalledWith(200);
  });
});

describe('getFlightClassById endpoint', () => {
  test('should return 200 http status code if flight exists', async () => {
    const flightClassId = 1;

    const flightClass = {
      id: flightClassId,
    };

    mockFlightClassService.getFlightClassById.mockImplementation(
      async (flightClassId) => {
        if (flightClassId == flightClass.id)
          return Promise.resolve(flightClass as FlightClass);

        return Promise.resolve(null as unknown as FlightClass);
      }
    );

    const mockReq = getMockReq();
    const { res: mockRes } = getMockRes();

    mockReq.params.id = `${flightClassId}`;

    await flightClassRouter.getFlightClassById(mockReq, mockRes);

    expect(mockFlightClassService.getFlightClassById).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(flightClass);
  });
});
