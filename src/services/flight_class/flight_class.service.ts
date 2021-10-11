import { FlightClass } from '../../entities/flight_class.entity';
import { FlightClassRepository } from '../../repositories/flight_class.repository';
import { invalidIdMsg, isValidId } from '../../utils/validateId';

export class FlightClassService {
  constructor(private flightClassRepository: FlightClassRepository) {}

  getAllFlightsClasses = async () => {
    return await this.flightClassRepository.find();
  };

  getFlightClassById = async (id: string) => {
    if (!isValidId(id)) {
      return Promise.reject(invalidIdMsg(id));
    }

    return await this.flightClassRepository.findOne({ id });
  };

  createFlightClass = async (flightClass: FlightClass) => {
    return await this.flightClassRepository.save(flightClass);
  };

  deleteFlightClassById = async (id: string) => {
    if (!isValidId(id)) {
      return Promise.reject(invalidIdMsg(id));
    }

    return await this.flightClassRepository.delete({ id });
  };

  updateFlightClass = async (id: string, newFlightClass: FlightClass) => {
    const result = await this.getFlightClassById(id);
    const updatedFlightClass = { ...result, ...newFlightClass };

    return await this.flightClassRepository.save(updatedFlightClass);
  };
}
