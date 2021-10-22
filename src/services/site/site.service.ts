import { Site } from '../../entities/site.entity';
import { CountryRepository } from '../../repositories/country.repository';
import { SiteRepository } from '../../repositories/site.repository';
import {
  CountryNotFoundException,
  SiteNotFoundException,
} from './site.exceptions';

export class SiteService {
  constructor(
    private siteRepository: SiteRepository,
    private countryRepository: CountryRepository
  ) {}

  async getAllSites(): Promise<Site[]> {
    return await this.siteRepository.find();
  }

  async getSiteById(id: number): Promise<Site> {
    const site = await this.siteRepository.findOne({ id });

    if (!site) {
      throw new SiteNotFoundException(id);
    }

    return site;
  }

  async createSite(countryId: number, providedSite: Site): Promise<Site> {
    const country = await this.countryRepository.findOne({ id: countryId });

    if (!country) {
      throw new CountryNotFoundException(countryId);
    }

    providedSite.country = country;

    return await this.siteRepository.save(providedSite);
  }

  async updateSite(
    siteId: number,
    countryId: number,
    providedSite: Site
  ): Promise<Site> {
    const country = this.countryRepository.findOne({ id: countryId });

    if (!country) {
      throw new CountryNotFoundException(countryId);
    }

    const site = await this.getSiteById(siteId);

    const updatedSite = new Site({ ...site, ...providedSite });

    await this.siteRepository.save(updatedSite);

    return await this.getSiteById(siteId);
  }

  async deleteSiteById(id: number): Promise<Site> {
    const site = await this.getSiteById(id);

    await this.siteRepository.delete({ id });

    return site;
  }
}
