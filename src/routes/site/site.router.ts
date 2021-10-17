import express, { Request, Response } from 'express';
import { validateParamsId } from '../../middleware/validate_id_format.middleware';
import {
  CountryNotFoundException,
  SiteNotFoundException,
} from '../../services/site/site.exceptions';
import { SiteService } from '../../services/site/site.service';
import { serializeError } from '../../utils/serializeError';
import { validate } from '../../utils/validation';
import { Site } from './../../entities/site.entity';
import { SiteRequest } from './site.request';
import { UpdateSiteRequest } from './update-site.request';

export const SiteRouter = (siteService: SiteService) => {
  const getAllSites = async (req: Request, res: Response) => {
    try {
      const sites = await siteService.getAllSites();

      return res.status(200).json(sites);
    } catch (error) {
      return res.sendStatus(500);
    }
  };

  const getSiteById = async (req: Request, res: Response) => {
    const siteId = parseInt(req.params.id);

    try {
      const site = await siteService.getSiteById(siteId);

      return res.status(200).json(site);
    } catch (error) {
      if (error instanceof SiteNotFoundException) {
        return res.status(404).json(serializeError(error.message));
      }

      return res.sendStatus(500);
    }
  };

  const createSite = async (req: Request, res: Response) => {
    const { countryId, ...siteRequest } = req.body;

    try {
      const newSite = await siteService.createSite(
        countryId,
        new Site(siteRequest)
      );

      return res.status(201).json(newSite);
    } catch (error) {
      if (error instanceof CountryNotFoundException) {
        return res.status(404).json(serializeError(error.message));
      }

      return res.sendStatus(500);
    }
  };

  const updateSite = async (req: Request, res: Response) => {
    const siteId = parseInt(req.params.id);
    const { countryId, ...providedSite } = req.body;

    try {
      const newSite = await siteService.updateSite(
        siteId,
        countryId,
        providedSite
      );

      return res.status(200).json(newSite);
    } catch (error) {
      if (
        error instanceof CountryNotFoundException ||
        error instanceof SiteNotFoundException
      ) {
        return res.status(404).json(serializeError(error.message));
      }

      return res.sendStatus(500);
    }
  };

  const deleteSite = async (req: Request, res: Response) => {
    const siteId = parseInt(req.params.id);

    try {
      const deletedSite = await siteService.deleteSiteById(siteId);

      return res.status(200).json(deletedSite);
    } catch (error) {
      if (error instanceof SiteNotFoundException) {
        return res.status(404).json(serializeError(error.message));
      }

      return res.sendStatus(500);
    }
  };

  const router = express.Router();

  router
    .route('/sites')
    .get(getAllSites)
    .post(validate(SiteRequest), createSite);

  router
    .route('/sites/:id')
    .get(validateParamsId, getSiteById)
    .delete(validateParamsId, deleteSite)
    .put(validateParamsId, validate(UpdateSiteRequest), updateSite);

  return {
    router,
    routes: {
      getAllSites,
      getSiteById,
      createSite,
      deleteSiteById: deleteSite,
      updateSite,
    },
  };
};
