import { Request, Response, Router } from 'express';
import { SiteService } from '../../services/site/site.service';
import { validate } from '../../utils/validation';
import { Site } from './../../entities/site.entity';
import { SiteRequest } from './site.request';

export const SiteRouter = (siteService: SiteService) => {

  const getAllSites = async (req: Request, res: Response) => {
    try {
      return res.status(200).json({ sites: await siteService.getAllSites() });
    } catch(error) {
      return res.status(500).json({ error });
    }
  };

  const getSiteById = async (req: Request, res: Response) => {
    const siteId = req.params.id;

    try {
      return res
        .status(200)
        .json({ site: await siteService.getSiteById(siteId) });
    } catch (error) {
      return res.status(400).json({ error });
    }
  };

  const createSite = async (req: Request, res: Response) => {
    const siteRequest = req.body as SiteRequest;

    try {
      const newSite = await siteService.createSite(
        new Site({ ...siteRequest })
      );

      return res.status(201).json({ site: newSite });
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
      return res.status(400).json({ error });
    }
  };

  const router = Router();

  router
    .route('/sites')
    .get(getAllSites)
    .post(validate(SiteRequest), createSite);
  router
    .route('/sites/:id')
    .get(getSiteById)
    .delete(deleteSiteById)
    .put(validate(SiteRequest), updateSite);

  return {
    router,
    routes: {
      getAllSites,
      getSiteById,
      createSite,
      deleteSiteById,
      updateSite,
    }
  };
};
