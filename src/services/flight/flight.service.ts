import { Flight } from '../../entities/flight.entity';
import { FlightRepository } from '../../repositories/flight.repository';
import { SiteService } from '../site/site.service';
import {
  FlightNotFoundException,
  InvalidFlightException,
} from './flight.exceptions';

export class FlightService {
  constructor(
    private flightRepository: FlightRepository,
    private siteService: SiteService
  ) {}

  async getAllFlights(): Promise<Flight[]> {
    return await this.flightRepository.find();
  }

  async getFlightById(id: number): Promise<Flight> {
    const flight = await this.flightRepository.findOne({ id });

    if (!flight) {
      throw new FlightNotFoundException(id);
    }

    return flight;
  }

  async createFlight(
    takeOffSiteId: number,
    landingSiteId: number,
    providedFlight: Flight
  ): Promise<Flight> {
    const takeOffSite = await this.siteService.getSiteById(takeOffSiteId);
    const landingSite = await this.siteService.getSiteById(landingSiteId);

    providedFlight.takeOffSite = takeOffSite;
    providedFlight.landingSite = landingSite;

    try {
      return await this.flightRepository.save(providedFlight);
    } catch {
      throw new InvalidFlightException();
    }
  }

  async updateFlight(id: number, providedFlight: Flight) {
    const flight = await this.getFlightById(id);
    const updatedFlight = { ...flight, ...providedFlight };

    return await this.flightRepository.save(updatedFlight);
  }

  async deleteFlightById(id: number) {
    const flight = await this.getFlightById(id);

    await this.flightRepository.delete({ id });

    return flight;
  }
}
