import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import { Repository } from 'typeorm';
import { Flight } from '../../entities/flight.entity';
import { Site } from '../../entities/site.entity';
import { SiteService } from '../site/site.service';
import { FlightService } from './flight.service';

let mockFlightRepository: MockProxy<Repository<Flight>>;
let mockSiteService: MockProxy<SiteService>;
let flightService: any;

beforeAll(() => {
  mockFlightRepository = mock<Repository<Flight>>();
  mockSiteService = mock<SiteService>();
  flightService = new FlightService(mockFlightRepository, mockSiteService);
});

afterEach(() => {
  mockReset(mockFlightRepository);
});

describe('getAllFlights method', () => {
  test('get all flights', async () => {
    mockFlightRepository.find.mockReturnValueOnce(Promise.resolve([]));

    await flightService.getAllFlights(1);

    expect(mockFlightRepository.find).toHaveBeenCalledTimes(1);
  });
});

describe('getFlightById method', () => {
  test('get flight ticket with a valid id', async () => {
    const flightId = 1;

    const flight = {
      id: 1,
      date: '2021-12-12',
      hour: '22:00',
      estimatedHours: 2,
      tickets: [{ id: 1 }],
      takeOffSite: { id: 1 },
      landingSite: { id: 1 },
    } as Flight;

    mockFlightRepository.findOne.mockReturnValue(Promise.resolve(flight));

    await flightService.getFlightById(flightId);

    expect(mockFlightRepository.findOne).toHaveBeenCalledWith({
      id: flightId,
    });
    expect(mockFlightRepository.findOne).toHaveReturned();
  });
});

describe('createFlight method', () => {
  test('create a new flight should work', async () => {
    const providedFlight = {
      date: '2021-12-12',
      hour: '22:00',
      estimatedHours: 2,
      tickets: [{ id: 1 }],
      takeOffSite: { id: 1 },
      landingSite: { id: 1 },
    } as Flight;

    const newFlight = { ...providedFlight, id: 1 } as Flight;

    mockSiteService.getSiteById.mockReturnValueOnce(
      Promise.resolve({} as unknown as Site)
    );
    mockFlightRepository.save.mockReturnValueOnce(Promise.resolve(newFlight));

    await flightService.createFlight(1, 2, providedFlight);

    expect(mockFlightRepository.save).toHaveBeenCalledWith(providedFlight);
    expect(mockFlightRepository.save).toHaveBeenCalledTimes(1);
    expect(mockFlightRepository.save).toHaveReturned();
  });
});

describe('updateFlight method', () => {
  test('update flight should work', async () => {
    const providedFlight = {
      date: '2021-12-12',
      hour: '25:00',
      estimatedHours: 5,
      tickets: [{ id: 1 }],
      takeOffSite: { id: 1 },
      landingSite: { id: 1 },
    } as Flight;

    const savedFlight = {
      date: '2021-12-12',
      hour: '24:00',
      estimatedHours: 5,
      tickets: [{ id: 1 }],
      takeOffSite: { id: 1 },
      landingSite: { id: 1 },
    } as Flight;

    mockFlightRepository.findOne.mockReturnValue(Promise.resolve(savedFlight));
    mockFlightRepository.save.mockReturnValueOnce(Promise.resolve(savedFlight));

    await flightService.updateFlight(1, providedFlight);

    expect(mockFlightRepository.findOne).toHaveBeenCalledTimes(2);
    expect(mockFlightRepository.save).toHaveBeenCalledTimes(1);
    expect(mockFlightRepository.save).toHaveBeenCalledWith(savedFlight);
  });
});

describe('deleteFlight method', () => {
  test('delete flight should work', async () => {
    const flight = {
      id: 1,
      date: '2021-12-12',
      hour: '24:00',
      estimatedHours: 5,
      tickets: [{ id: 1 }],
      takeOffSite: { id: 1 },
      landingSite: { id: 1 },
    } as Flight;

    mockFlightRepository.findOne.mockReturnValueOnce(
      Promise.resolve(flight as Flight)
    );

    await flightService.deleteFlightById(flight.id);

    expect(mockFlightRepository.findOne).toHaveBeenCalledTimes(1);
    expect(mockFlightRepository.delete).toHaveBeenCalledTimes(1);
    expect(mockFlightRepository.delete).toHaveBeenCalledWith({ id: 1 });
  });
});
