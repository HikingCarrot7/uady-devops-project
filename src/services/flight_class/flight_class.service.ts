import { FlightClassRepository } from '../../repositories/flight_class.repository';
import { FlightClassNotFoundException } from './flight_class.exeptions';

export class FlightClassService {
  constructor(private flightClassRepository: FlightClassRepository) {}

  async getAllFlightsClasses() {
    return await this.flightClassRepository.find();
  }

  async getFlightClassById(id: number) {
    const flightClass = await this.flightClassRepository.findOne({ id });

    if (!flightClass) {
      throw new FlightClassNotFoundException(id);
    }

    return flightClass;
  }
}
