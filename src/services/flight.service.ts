import { Flight } from 'entities/flight.entity';
import { FlightRepository } from 'repositories/flight.repository';

export const FlightService = (flightRepository: FlightRepository) => {
  const getAllFlights = async () => {
    return await flightRepository.find();
  };

  const getFlightById = async (id: string) => {
    const parsedId = parseInt(id);

    if (isNaN(parsedId)) {
      return Promise.reject('ID inválido');
    }

    return await flightRepository.findOne({ id: parsedId });
  };

  const createFlight = async (flight: Flight) => {
    const newFlight = await flightRepository.save(flight);
    return newFlight;
  };

  const deleteFlightById = async (id: string) => {
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      return Promise.reject('ID inválido');
    }
    return await flightRepository.delete({ id: parsedId });
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
