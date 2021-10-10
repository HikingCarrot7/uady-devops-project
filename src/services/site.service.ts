import { Site } from 'entities/site.entity';
import { SiteRepository } from 'repositories/site.repository';

export const SiteService = (siteRepository: SiteRepository) => {
  const getAllSites = async () => {
    return await siteRepository.find();
  };

  const getSiteById = async (id: string) => {
    const parsedId = parseInt(id);

    if (isNaN(parsedId)) {
      return Promise.reject('ID inválido');
    }

    return await siteRepository.find({ id: parsedId });
  };

  const createSite = async (site: Site) => {
    const newSite = await siteRepository.save(site);
    return newSite;
  };

  const deleteSiteById = async (id: string) => {
    const parsedId = parseInt(id);
    if(isNaN(parsedId)) {
      return Promise.reject('ID inválido');
    }
    return await siteRepository.delete({ id: parsedId });
  };

  const updateSite = async (id: string, newSite: Site) => {
    const result = await getSiteById(id);
    const updatedSite = {...result[0], ...newSite};
    return await siteRepository.save(updatedSite);
  };

  return { getAllSites, getSiteById, createSite, deleteSiteById, updateSite };
};
