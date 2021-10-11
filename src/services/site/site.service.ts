import { Site } from '../../entities/site.entity';
import { SiteRepository } from '../../repositories/site.repository';
import { invalidIdMsg, isValidId } from '../../utils/validateId';

export const SiteService = (siteRepository: SiteRepository) => {
  const getAllSites = async () => {
    return await siteRepository.find();
  };

  const getSiteById = async (id: string) => {
    if (!isValidId(id)) {
      return Promise.reject(invalidIdMsg(id));
    }

    return await siteRepository.findOne({ id });
  };

  const createSite = async (site: Site) => {
    return await siteRepository.save(site);
  };

  const deleteSiteById = async (id: string) => {
    if (!isValidId(id)) {
      return Promise.reject(invalidIdMsg(id));
    }
    const site = siteRepository.findOne({ id });

    if(!site) {
      return null;
    }

    return await siteRepository.delete({ id });
  };

  const updateSite = async (id: string, newSite: Site) => {
    const result = await getSiteById(id);
    const updatedSite = { ...result, ...newSite };

    return await siteRepository.save(updatedSite);
  };

  return { getAllSites, getSiteById, createSite, deleteSiteById, updateSite };
};
