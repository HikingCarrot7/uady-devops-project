import { Flight } from '../../entities/flight.entity';
import { Site } from '../../entities/site.entity';
import { FlightRepository } from '../../repositories/flight.repository';
import { SiteService } from '../site/site.service';
import {
  FlightNotFoundException,
  InvalidFlightException,
  SameTakeOffAndLandingSiteException,
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

  async updateFlight(
    id: number,
    takeOffSiteId: number | undefined,
    landingSiteId: number | undefined,
    providedFlight: Flight
  ): Promise<Flight> {
    let takeOffSite: Site | undefined;
    let landingSite: Site | undefined;

    const flight = await this.getFlightById(id);

    if (takeOffSiteId) {
      takeOffSite = await this.siteService.getSiteById(takeOffSiteId);
      flight.takeOffSite = takeOffSite;
    }

    if (landingSiteId) {
      landingSite = await this.siteService.getSiteById(landingSiteId);
      flight.landingSite = landingSite;
    }

    if (takeOffSite && takeOffSite.id === flight.landingSite.id) {
      throw new SameTakeOffAndLandingSiteException();
    }

    if (landingSite && landingSite.id === flight.takeOffSite.id) {
      throw new SameTakeOffAndLandingSiteException();
    }

    const updatedFlight = { ...flight, ...providedFlight };

    try {
      return await this.flightRepository.save(updatedFlight);
    } catch {
      throw new InvalidFlightException();
    }
  }

  async deleteFlightById(id: number) {
    const flight = await this.getFlightById(id);

    await this.flightRepository.delete({ id });

    return flight;
  }
}
