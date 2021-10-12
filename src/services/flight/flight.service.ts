import { Flight } from '../../entities/flight.entity';
import { FlightRepository } from '../../repositories/flight.repository';
import { invalidIdMsg, isValidId } from '../../utils/validateId';

export class FlightService {
  constructor(private flightRepository: FlightRepository) {}

  getAllFlights = async () => {
    return await this.flightRepository.find();
  };

  getFlightById = async (id: string) => {
    if (!isValidId(id)) {
      return Promise.reject(invalidIdMsg(id));
    }

    return await this.flightRepository.findOne({ id });
  };

  createFlight = async (flight: Flight) => {
    return await this.flightRepository.save(flight);
  };

  updateFlight = async (id: string, newFlight: Flight) => {
    const result = await this.getFlightById(id);
    const updatedFlight = { ...result, ...newFlight };

    return await this.flightRepository.save(updatedFlight);
  };

  deleteFlightById = async (id: string) => {
    if (!isValidId(id)) {
      return Promise.reject(invalidIdMsg(id));
    }

    return await this.flightRepository.delete({ id });
  };
}
