import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import { Repository } from 'typeorm';
import { FlightTicket } from '../../entities/flight_ticket.entity';
import { invalidIdMsg } from '../../utils/validateId';
import { FlightTicketService } from './flight_ticket.service';

let mockFlightTicketsRepository: MockProxy<Repository<FlightTicket>>;
let flightTicketService: any;

beforeAll(() => {
  mockFlightTicketsRepository = mock<Repository<FlightTicket>>();
  flightTicketService = FlightTicketService(mockFlightTicketsRepository);
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

    mockFlightTicketsRepository.findOne.mockReturnValue(
      Promise.resolve(ticket)
    );

    await flightTicketService.getFlightTicketById(ticketId);

    expect(mockFlightTicketsRepository.findOne).toHaveBeenCalledWith({
      id: ticketId,
    });
    expect(mockFlightTicketsRepository.findOne).toHaveReturned();
  });
});

describe('createFlightTicket method', () => {
  test('create a new ticket should work', async () => {
    const providedTicket = {
      user: { id: 1 },
      flight: { id: 1 },
      flightClass: { id: 1 },
      passengers: 5,
    } as FlightTicket;

    const newTicket = { ...providedTicket, id: 1 } as FlightTicket;

    mockFlightTicketsRepository.save.mockReturnValueOnce(
      Promise.resolve(newTicket)
    );

    await flightTicketService.createFlightTicket(
      providedTicket.user.id,
      providedTicket.flight.id,
      providedTicket.flightClass.id,
      providedTicket.passengers
    );

    expect(mockFlightTicketsRepository.save).toHaveBeenCalledWith(
      providedTicket
    );
    expect(mockFlightTicketsRepository.save).toHaveBeenCalledTimes(1);
    expect(mockFlightTicketsRepository.save).toHaveReturned();
  });
});

describe('UpdateFlightTicket method', () => {
  test('update flight ticket should work', async () => {
    const providedTicket = {
      user: { id: 1 },
      flight: { id: 1 },
      flightClass: { id: 1 },
      passengers: 6,
    } as FlightTicket;

    const fetchedTicket = {
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

    mockFlightTicketsRepository.save.mockReturnValueOnce(
      Promise.resolve(savedTicket)
    );

    mockFlightTicketsRepository.findOne.mockReturnValueOnce(
      Promise.resolve(fetchedTicket)
    );

    await flightTicketService.updateFlightTicket(1, providedTicket);

    expect(mockFlightTicketsRepository.findOne).toHaveBeenCalledTimes(1);
    expect(mockFlightTicketsRepository.findOne).toHaveBeenCalledWith(1);
    expect(mockFlightTicketsRepository.save).toHaveBeenCalledWith(savedTicket);
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

    expect(mockFlightTicketsRepository.findOne).toBeCalledWith(1);
    expect(mockFlightTicketsRepository.delete).toHaveBeenCalledTimes(1);
  });
});
