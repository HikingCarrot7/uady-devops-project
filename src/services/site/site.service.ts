import { Site } from '../../entities/site.entity';
import { SiteRepository } from '../../repositories/site.repository';
import { invalidIdMsg, isValidId } from '../../utils/validateId';

export class SiteService {
  constructor(private siteRepository: SiteRepository) {}

  getAllSites = async () => {
    return await this.siteRepository.find();
  };

  getSiteById = async (id: string) => {
    if (!isValidId(id)) {
      return Promise.reject(invalidIdMsg(id));
    }

    return await this.siteRepository.findOne({ id });
  };

  createSite = async (site: Site) => {
    return await this.siteRepository.save(site);
  };

  deleteSiteById = async (id: string) => {
    if (!isValidId(id)) {
      return Promise.reject(invalidIdMsg(id));
    }

    return await this.siteRepository.delete({ id });
  };

  updateSite = async (id: string, newSite: Site) => {
    const result = await this.getSiteById(id);
    const updatedSite = { ...result, ...newSite };

    return await this.siteRepository.save(updatedSite);
  };
}
