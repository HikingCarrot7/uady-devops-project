import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import { Repository } from 'typeorm';
import { Flight } from '../../entities/flight.entity';
import { FlightClass } from '../../entities/flight_class.entity';
import { FlightTicket } from '../../entities/flight_ticket.entity';
import { User } from '../../entities/user.entity';
import { invalidIdMsg } from '../../utils/validate_id';
import { FlightService } from '../flight/flight.service';
import { FlightClassService } from '../flight_class/flight_class.service';
import { UserService } from '../user/user.service';
import { FlightTicketService } from './flight_ticket.service';

let mockFlightTicketsRepository: MockProxy<Repository<FlightTicket>>;
let mockUserService: MockProxy<UserService>;
let mockFlightService: MockProxy<FlightService>;
let mockFlightClassService: MockProxy<FlightClassService>;
let flightTicketService: any;

beforeAll(() => {
  mockFlightTicketsRepository = mock<Repository<FlightTicket>>();
  mockUserService = mock<UserService>();
  mockFlightService = mock<FlightService>();
  mockFlightClassService = mock<FlightClassService>();

  flightTicketService = new FlightTicketService(
    mockFlightTicketsRepository,
    mockUserService,
    mockFlightService,
    mockFlightClassService
  );
});

afterEach(() => {
  mockReset(mockFlightTicketsRepository);
});

describe('getUserFlightTickets method', () => {
  test('get user flight tickets', async () => {
    mockFlightTicketsRepository.find.mockReturnValueOnce(Promise.resolve([]));

    await flightTicketService.getUserFlightTickets(1);

    expect(mockFlightTicketsRepository.find).toHaveBeenCalledTimes(1);
  });

  test('get user flight tickets when id is invalid', async () => {
    const invalidId = 'invalidId';

    mockFlightTicketsRepository.find.mockReturnValueOnce(Promise.resolve([]));

    return flightTicketService
      .getUserFlightTickets(invalidId)
      .catch((e: any) => {
        expect(e).toEqual(invalidIdMsg(invalidId));
      });
  });

  test('get user flight tickets when id does not exists', async () => {
    const invalidId = 4;

    mockFlightTicketsRepository.find.mockReturnValueOnce(Promise.resolve([]));

    await flightTicketService.getUserFlightTickets(invalidId);

    expect(mockFlightTicketsRepository.find).toHaveReturned();
  });
});

describe('getFlightTicketById method', () => {
  test('get flight ticket with a valid id', async () => {
    const ticketId = 1;

    const ticket = {
      id: 1,
      user: { id: 1 },
      flight: { id: 1 },
      flightClass: { id: 1 },
      passengers: 5,
    } as FlightTicket;

    mockFlightTicketsRepository.findOne.mockReturnValueOnce(
      Promise.resolve(ticket)
    );

    await flightTicketService.getFlightTicketById(ticketId);

    expect(mockFlightTicketsRepository.findOne).toHaveBeenCalledWith({
      where: {
        id: ticketId,
      },
    });
    expect(mockFlightTicketsRepository.findOne).toHaveReturned();
  });
});

describe('createFlightTicket method', () => {
  test('create a new ticket should work', async () => {
    const providedTicket = {
      userId: 1,
      flightId: 1,
      flightClassId: 1,
      passengers: 5,
    };

    const { userId, flightId, flightClassId, ...restProvidedTicket } =
      providedTicket;

    const newTicket = new FlightTicket({
      user: { id: 1 } as User,
      flight: { id: 1 } as Flight,
      flightClass: { id: 1 } as FlightClass,
      ...restProvidedTicket,
    });

    mockUserService.getUserById.mockImplementation((id) =>
      Promise.resolve(newTicket.user)
    );

    mockFlightService.getFlightById.mockImplementation((id) =>
      Promise.resolve(newTicket.flight)
    );

    mockFlightClassService.getFlightClassById.mockImplementation((id) =>
      Promise.resolve(newTicket.flightClass)
    );

    mockFlightTicketsRepository.save.mockReturnValueOnce(
      Promise.resolve(newTicket)
    );

    mockFlightTicketsRepository.findOne.mockReturnValueOnce(
      Promise.resolve(newTicket)
    );

    await flightTicketService.createFlightTicket(
      userId,
      flightId,
      flightClassId,
      restProvidedTicket
    );

    expect(mockFlightTicketsRepository.save).toHaveBeenCalledWith(newTicket);
    expect(mockFlightTicketsRepository.save).toHaveBeenCalledTimes(1);
    expect(mockFlightTicketsRepository.save).toHaveReturned();
  });
});

describe('UpdateFlightTicket method', () => {
  test('update flight ticket should work', async () => {
    const fetchedTicket = {
      id: 1,
      user: { id: 1 },
      flight: { id: 1 },
      flightClass: { id: 1 },
      passengers: 5,
    } as FlightTicket;

    const savedTicket = {
      user: { id: 1 },
      flight: { id: 1 },
      flightClass: { id: 1 },
      passengers: 6,
    } as FlightTicket;

    mockFlightTicketsRepository.save.mockReturnValue(
      Promise.resolve(savedTicket)
    );

    mockFlightTicketsRepository.find.mockReturnValueOnce(
      Promise.resolve([fetchedTicket])
    );

    mockFlightClassService.getFlightClassById.mockImplementation((id) =>
      Promise.resolve({ id: 1 } as FlightClass)
    );
  });
});

describe('deleteFlightTicket method', () => {
  test('delete flight ticket', async () => {
    const ticket = {
      id: 1,
      user: { id: 1 },
      flight: { id: 1 },
      flightClass: { id: 1 },
      passengers: 5,
    } as FlightTicket;

    mockFlightTicketsRepository.findOne.mockReturnValueOnce(
      Promise.resolve(ticket)
    );

    await flightTicketService.deleteFlightTicket(ticket.id);

    expect(mockFlightTicketsRepository.findOne).toBeCalledWith({
      where: {
        id: 1,
      },
    });

    expect(mockFlightTicketsRepository.delete).toHaveBeenCalledTimes(1);
  });
});
