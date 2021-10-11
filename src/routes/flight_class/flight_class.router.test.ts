import { getMockReq, getMockRes } from '@jest-mock/express';
import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import { DeleteResult } from 'typeorm';
import { FlightClass } from '../../entities/flight_class.entity';
import { FlightClassService } from '../../services/flight_class/flight_class.service';
import { invalidIdMsg, isValidId } from '../../utils/validateId';
import { FlightClassRouter } from './flight_class.router';

let mockFlightClassService: MockProxy<FlightClassService>;
let flightClassRouter: any;

beforeAll(() => {
  mockFlightClassService = mock<FlightClassService>();
  flightClassRouter = FlightClassRouter(mockFlightClassService);
});

afterEach(() => {
  mockReset(mockFlightClassService);
});

describe('getAllFlightsClasses endpoint', () => {
  test('get all flights classes should return 200 http status code', async () => {
    mockFlightClassService.getAllFlightsClasses.mockImplementation();

    const mockReq = getMockReq();
    const { res: mockRes } = getMockRes();

    await flightClassRouter.routes.getAllFlightsClasses(mockReq, mockRes);

    expect(mockFlightClassService.getAllFlightsClasses).toHaveBeenCalledTimes(
      1
    );

    expect(mockRes.status).toHaveBeenCalledWith(200);
  });
});

describe('getFlightClassById endpoint', () => {
  test('should return 200 http status code if flight exists', async () => {
    const flightClassId = '1';

    const flightClass = {
      id: parseInt(flightClassId),
    };

    mockFlightClassService.getFlightClassById.mockImplementation(
      async (flightClassId) => {
        if (!isValidId(flightClassId)) {
          return Promise.reject(invalidIdMsg(flightClassId));
        }

        if (flightClassId == flightClass.id)
          return Promise.resolve(flightClass as FlightClass);

        return Promise.resolve(null as unknown as FlightClass);
      }
    );

    const mockReq = getMockReq();
    const { res: mockRes } = getMockRes();

    mockReq.params.id = flightClassId;

    await flightClassRouter.routes.getFlightClassById(mockReq, mockRes);

    expect(mockFlightClassService.getFlightClassById).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ flightClass: flightClass });
  });
});

describe('createFlightClass endpoint', () => {
  test('should return 201 http status code when new flight class created', async () => {
    const reqBody = {
      cabinClass: 0,
      price: 1500,
      tickets: [{ id: 1 }],
    };

    mockFlightClassService.createFlightClass.mockImplementation(() => {
      return Promise.resolve({
        id: 1,
        ...reqBody,
      } as unknown as FlightClass);
    });

    const mockReq = getMockReq();
    const { res: mockRes } = getMockRes();

    mockReq.body = reqBody;

    await flightClassRouter.routes.createFlightClass(mockReq, mockRes);

    expect(mockFlightClassService.createFlightClass).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(201);
  });
});

describe('updateFlightClass endpoint', () => {
  test('should return 200 http status code when flight class updated', async () => {
    const flightClassId = '1';

    const reqBody = {
      price: 2500,
    };

    mockFlightClassService.updateFlightClass.mockImplementation(() => {
      return Promise.resolve({
        ...reqBody,
      } as FlightClass);
    });

    const mockReq = getMockReq();
    const { res: mockRes } = getMockRes();

    mockReq.params.id = flightClassId;
    mockReq.body = reqBody;

    await flightClassRouter.routes.updateFlightClass(mockReq, mockRes);

    expect(mockFlightClassService.updateFlightClass).toHaveBeenCalledTimes(1);
    expect(mockFlightClassService.updateFlightClass).toHaveBeenCalledWith(
      flightClassId,
      reqBody
    );
    expect(mockRes.status).toBeCalledWith(200);
  });
});

describe('deleteFlightClass endpoint', () => {
  test('should return 200 http status when flight class deleted', async () => {
    const flightClassId = '1';
    const flightClassDeleted = {
      raw: '',
      afected: 1,
    };

    mockFlightClassService.deleteFlightClassById.mockImplementation(
      (flightClassId) => {
        return Promise.resolve(flightClassDeleted as DeleteResult);
      }
    );

    const mockReq = getMockReq();
    const { res: mockRes } = getMockRes();

    mockReq.params.id = flightClassId;

    await flightClassRouter.routes.deleteFlightClassById(mockReq, mockRes);

    expect(mockFlightClassService.deleteFlightClassById).toHaveBeenCalledTimes(
      1
    );
    expect(mockFlightClassService.deleteFlightClassById).toHaveBeenCalledWith(
      flightClassId
    );
    expect(mockRes.status).toBeCalledWith(200);
  });
});
