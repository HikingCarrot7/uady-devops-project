import { Flight } from '../../entities/flight.entity';
import { FlightRepository } from '../../repositories/flight.repository';
import { invalidIdMsg, isValidId } from '../../utils/validateId';

export const FlightService = (flightRepository: FlightRepository) => {
  const getAllFlights = async () => {
    return await flightRepository.find();
  };

  const getFlightById = async (id: string) => {
    if (!isValidId(id)) {
      return Promise.reject(invalidIdMsg(id));
    }

    return await flightRepository.findOne({ id });
  };

  const createFlight = async (flight: Flight) => {
    return await flightRepository.save(flight);
  };

  const deleteFlightById = async (id: string) => {
    if (!isValidId(id)) {
      return Promise.reject(invalidIdMsg(id));
    }

    return await flightRepository.delete({ id });
  };

  const updateFlight = async (id: string, newFlight: Flight) => {
    const result = await getFlightById(id);
    const updatedFlight = { ...result, ...newFlight };

    return await flightRepository.save(updatedFlight);
  };

  return {
    getAllFlights,
    getFlightById,
    createFlight,
    deleteFlightById,
    updateFlight,
  };
};
