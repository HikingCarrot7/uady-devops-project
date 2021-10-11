import { FlightClass } from './../../entities/flight_class.entity';
import { FlightClassRepository } from './../../repositories/flight_class.repository';

export const FlightClassService = (
  flightClassRepository: FlightClassRepository
) => {
  const getAllFlightsClasses = async () => {
    return await flightClassRepository.find();
  };

  const getFlightClassById = async (id: string) => {
    const parsedId = parseInt(id);

    if (isNaN(parsedId)) {
      return Promise.reject('ID inválido');
    }

    return await flightClassRepository.findOne({ id: parsedId });
  };

  const createFlightClass = async (flightClass: FlightClass) => {
    const newFlightClass = await flightClassRepository.save(flightClass);
    return newFlightClass;
  };

  const deleteFlightClassById = async (id: string) => {
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      return Promise.reject('ID inválido');
    }
    return await flightClassRepository.delete({ id: parsedId });
  };

  const updateFlightClass = async (id: string, newFlightClass: FlightClass) => {
    const result = await getFlightClassById(id);
    const updatedFlightClass = { ...result, ...newFlightClass };
    return await flightClassRepository.save(updatedFlightClass);
  };

  return {
    getAllFlightsClasses,
    getFlightClassById,
    createFlightClass,
    deleteFlightClassById,
    updateFlightClass,
  };
};
