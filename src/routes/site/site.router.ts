import { Request, Response, Router } from 'express';
import { Loggable } from '../../middleware/loggable.middleware';
import {
  CountryNotFoundException,
  SiteNotFoundException,
} from '../../services/site/site.exceptions';
import { SiteService } from '../../services/site/site.service';
import { serializeError } from '../../utils/serialize_error';
import { validate } from '../../utils/validation';
import { Site } from './../../entities/site.entity';
import { SiteRequest } from './site.request';
import { UpdateSiteRequest } from './update_site.request';

export const SiteRouter = (router: Router, siteService: SiteService) => {
  class SiteRouterClass {
    constructor() {
      router
        .route('/sites')
        .get(this.getAllSites)
        .post(validate(SiteRequest), this.createSite);

      router
        .route('/sites/:id')
        .get(this.getSiteById)
        .delete(this.deleteSite)
        .put(validate(UpdateSiteRequest), this.updateSite);
    }

    @Loggable
    async getAllSites(req: Request, res: Response) {
      try {
        const sites = await siteService.getAllSites();

        return res.status(200).json(sites);
      } catch (error) {
        return res.status(500).json(serializeError(error));
      }
    }

    @Loggable
    async getSiteById(req: Request, res: Response) {
      const siteId = parseInt(req.params.id);

      try {
        const site = await siteService.getSiteById(siteId);

        return res.status(200).json(site);
      } catch (error) {
        if (error instanceof SiteNotFoundException) {
          return res.status(404).json(serializeError(error.message));
        }

        return res.status(500).json(serializeError(error));
      }
    }

    @Loggable
    async createSite(req: Request, res: Response) {
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

        return res.status(500).json(serializeError(error));
      }
    }

    @Loggable
    async updateSite(req: Request, res: Response) {
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
          SiteNotFoundException
        ) {
          return res.status(404).json(serializeError(error.message));
        }

        return res.status(500).json(serializeError(error));
      }
    }

    @Loggable
    async deleteSite(req: Request, res: Response) {
      const siteId = parseInt(req.params.id);

      try {
        const deletedSite = await siteService.deleteSiteById(siteId);

        return res.status(200).json(deletedSite);
      } catch (error) {
        if (error instanceof SiteNotFoundException) {
          return res.status(404).json(serializeError(error.message));
        }

        return res.status(500).json(serializeError(error));
      }
    }
  }

  return new SiteRouterClass();
};
