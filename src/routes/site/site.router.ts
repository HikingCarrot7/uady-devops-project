import { Request, Response, Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { SiteRepository } from '../../repositories/site.repository';
import { SiteService } from '../../services/site.service';
import { validate } from '../../utils/validation';
import { Site } from './../../entities/site.entity';
import { SiteRequest } from './site.request';

export const SiteRouter = () => {
  const siteService = SiteService(getCustomRepository(SiteRepository));

  const getAllSites = async (req: Request, res: Response) => {
    return res.status(200).json({ sites: await siteService.getAllSites() });
  };

  const getSiteById = async (req: Request, res: Response) => {
    const siteId = req.params.id;

    try {
      return res
        .status(200)
        .json({ site: await siteService.getSiteById(siteId) });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error });
    }
  };

  const createSite = async (req: Request, res: Response) => {
    const siteRequest = req.body as SiteRequest;

    try {
      const newSite = await siteService.createSite(
        new Site({ ...siteRequest })
      );

      return res.status(200).json({ site: newSite });
    } catch (error) {
      return res.status(400).json({ error });
    }
  };

  const deleteSiteById = async (req: Request, res: Response) => {
    const siteId = req.params.id;
    try {
      return res
        .status(200)
        .json({ site: await siteService.deleteSiteById(siteId) });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error });
    }
  };

  const updateSite = async (req: Request, res: Response) => {
    const siteId = req.params.id;
    const siteData = req.body;
    try {
      return res
        .status(200)
        .json({ site: await siteService.updateSite(siteId, siteData) });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error });
    }    
  };

  const router = Router();

  router.route('/sites').get(getAllSites);
  router.route('/sites').post(validate(SiteRequest), createSite);
  router.route('/sites/:id').get(getSiteById);
  router.route('/sites/:id').delete(deleteSiteById);
  router.route('/sites/:id').put(validate(SiteRequest), updateSite);

  return { router };
};