import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import { Repository } from 'typeorm';
import { FlightClass } from '../../entities/flight_class.entity';
import { FlightClassService } from './flight_class.service';

let mockFlightClassRepository: MockProxy<Repository<FlightClass>>;
let flightClassService: any;

beforeAll(() => {
  mockFlightClassRepository = mock<Repository<FlightClass>>();
  flightClassService = new FlightClassService(mockFlightClassRepository);
});

afterEach(() => {
  mockReset(mockFlightClassRepository);
});

describe('getAllFlightsClasses method', () => {
  test('get all flights classes', async () => {
    mockFlightClassRepository.find.mockReturnValueOnce(Promise.resolve([]));

    await flightClassService.getAllFlightsClasses(1);

    expect(mockFlightClassRepository.find).toHaveBeenCalledTimes(1);
  });
});

describe('getFlightClassById method', () => {
  test('get flight class with a valid id', async () => {
    const flightClassId = 1;

    const flightClass = {
      id: 1,
      cabinClass: 0,
      price: 1500,
      tickets: [{ id: 1 }],
    } as FlightClass;

    mockFlightClassRepository.findOne.mockReturnValue(
      Promise.resolve(flightClass)
    );

    await flightClassService.getFlightClassById(flightClassId);

    expect(mockFlightClassRepository.findOne).toHaveBeenCalledWith({
      id: flightClassId,
    });
    expect(mockFlightClassRepository.findOne).toHaveReturned();
  });
});

describe('createFlightClass method', () => {
  test('create a new flight class should work', async () => {
    const providedFlightClass = {
      cabinClass: 0,
      price: 1500,
      tickets: [{ id: 1 }],
    } as FlightClass;

    const newFlightClass = { ...providedFlightClass, id: 1 } as FlightClass;

    mockFlightClassRepository.save.mockReturnValueOnce(
      Promise.resolve(newFlightClass)
    );

    await flightClassService.createFlightClass(providedFlightClass);

    expect(mockFlightClassRepository.save).toHaveBeenCalledWith(
      providedFlightClass
    );
    expect(mockFlightClassRepository.save).toHaveBeenCalledTimes(1);
    expect(mockFlightClassRepository.save).toHaveReturned();
  });
});

describe('updateFlightClass method', () => {
  test('update flight class should work', async () => {
    const providedFlightClass = {
      cabinClass: 1,
      price: 30000,
      tickets: [{ id: 1 }],
    } as FlightClass;

    const savedFlightClass = {
      cabinClass: 1,
      price: 30000,
      tickets: [{ id: 1 }],
    } as FlightClass;

    mockFlightClassRepository.save.mockReturnValueOnce(
      Promise.resolve(savedFlightClass)
    );

    await flightClassService.updateFlightClass(1, providedFlightClass);

    expect(mockFlightClassRepository.save).toHaveBeenCalledWith(
      savedFlightClass
    );
  });
});

describe('deleteFlightClass method', () => {
  test('delete flight class should work', async () => {
    const flightClass = {
      id: 1,
      cabinClass: 0,
      price: 1500,
      tickets: [{ id: 1 }],
    } as FlightClass;

    await flightClassService.deleteFlightClassById(flightClass.id);

    expect(mockFlightClassRepository.delete).toHaveBeenCalledTimes(1);
    expect(mockFlightClassRepository.delete).toHaveBeenCalledWith({ id: 1 });
  });
});
