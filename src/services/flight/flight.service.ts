import { QueryFailedError } from 'typeorm';
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
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new InvalidFlightException();
      }

      throw error;
    }
  }

  async updateFlight(
    id: number,
    takeOffSiteId: UndefinedOr<number>,
    landingSiteId: UndefinedOr<number>,
    providedFlight: Flight
  ): Promise<Flight> {
    let takeOffSite: UndefinedOr<Site>;
    let landingSite: UndefinedOr<Site>;

    const flight = await this.getFlightById(id);

    if (takeOffSiteId) {
      takeOffSite = await this.siteService.getSiteById(takeOffSiteId);
      flight.takeOffSite = takeOffSite;
    }

    if (landingSiteId) {
      landingSite = await this.siteService.getSiteById(landingSiteId);
      flight.landingSite = landingSite;
    }

    /* Esta validación se debe porque no siempre se puede 
    proveer el id del vuelo de origen Y el de destino en el request. */
    if (
      (takeOffSite && takeOffSite.id === flight.landingSite.id) ||
      (landingSite && landingSite.id === flight.takeOffSite.id)
    ) {
      throw new SameTakeOffAndLandingSiteException();
    }

    const updatedFlight = new Flight({ ...flight, ...providedFlight });

    try {
      await this.flightRepository.save(updatedFlight);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new InvalidFlightException();
      }

      throw error;
    }

    return await this.getFlightById(id);
  }

  async deleteFlightById(id: number) {
    const flight = await this.getFlightById(id);

    await this.flightRepository.delete({ id });

    return flight;
  }
}
