import { getMockReq, getMockRes } from '@jest-mock/express';
import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import { Site } from '../../entities/site.entity';
import { SiteService } from '../../services/site/site.service';
import { invalidIdMsg, isNumericId } from '../../utils/validateId';
import { SiteRouter } from './site.router';

let mockSiteService: MockProxy<SiteService>;
let siteRouter: any;

beforeAll(() => {
  mockSiteService = mock<SiteService>();
  siteRouter = SiteRouter(mockSiteService);
});

afterEach(() => {
  mockReset(mockSiteService);
});

describe('getAllSites endpoint', () => {
  test('get all sites should return 200 http status if typeorm can connect to mysql', async () => {
    mockSiteService.getAllSites.mockReturnValueOnce(Promise.resolve([]));

    const mockReq = getMockReq();
    const { res: mockRes } = getMockRes();

    await siteRouter.routes.getAllSites(mockReq, mockRes);

    expect(mockSiteService.getAllSites).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith([]);
  });

  test('get all sites should return 500 http status if typeorm can´t connect to mysql', async () => {
    mockSiteService.getAllSites.mockReturnValueOnce(Promise.reject({}));

    const mockReq = getMockReq();
    const { res: mockRes } = getMockRes();

    await siteRouter.routes.getAllSites(mockReq, mockRes);

    expect(mockSiteService.getAllSites).toHaveBeenCalledTimes(1);
    expect(mockRes.sendStatus).toHaveBeenCalledWith(500);
    expect(mockRes.json).not.toBeCalled();
  });
});

describe('getSiteById endpoint', () => {
  test('should return 200 http status code if the site exists', async () => {
    const siteId = '1';

    const site = {
      id: parseInt(siteId),
      country: { id: 1, name: 'México', phoneCode: 52 },
      state: 'Yucatán',
      city: 'Mérida',
    };

    mockSiteService.getSiteById.mockImplementation(async (siteId) => {
      if (siteId == site.id) return Promise.resolve(site as Site);

      return Promise.resolve(null as unknown as Site);
    });

    const mockReq = getMockReq();
    const { res: mockRes } = getMockRes();

    mockReq.params.id = siteId;

    await siteRouter.routes.getSiteById(mockReq, mockRes);

    expect(mockSiteService.getSiteById).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(200);
    expect(mockRes.json).toBeCalledWith(site);
  });

  test('should return 500 http status code if the site id is invalid', async () => {
    const siteId = 'abc';

    const site = {
      id: 1,
      country: { id: 1, name: 'México', phoneCode: 52 },
      state: 'Yucatan',
      city: 'Merida',
    };

    mockSiteService.getSiteById.mockImplementation(async (siteId) => {
      if (!isNumericId(siteId)) {
        return Promise.reject(invalidIdMsg(siteId));
      }

      if (siteId == site.id) return Promise.resolve(site as Site);

      return Promise.resolve(null as unknown as Site);
    });

    const mockReq = getMockReq();
    const { res: mockRes } = getMockRes();

    mockReq.params.id = siteId;

    await siteRouter.routes.getSiteById(mockReq, mockRes);

    expect(mockSiteService.getSiteById).toBeCalledTimes(1);
    expect(mockRes.sendStatus).toBeCalledWith(500);
    expect(mockRes.json).not.toBeCalled();
  });
});

describe('createSite endpoint', () => {
  test('should return 201 http status code when new site is created', async () => {
    const reqBody = {
      countryId: 1,
      state: 'Yucatán',
      city: 'Mérida',
    };

    mockSiteService.createSite.mockImplementation(() => {
      return Promise.resolve({
        id: 1,
        ...reqBody,
      } as unknown as Site);
    });

    const mockReq = getMockReq();
    const { res: mockRes } = getMockRes();

    mockReq.body = reqBody;

    await siteRouter.routes.createSite(mockReq, mockRes);

    expect(mockSiteService.createSite).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({ id: 1, ...reqBody });
  });
});

describe('updateSite endpoint', () => {
  test('should return 200 http status code when a site is updated', async () => {
    const siteId = 1;

    const providedSite = {
      countryId: 1,
      state: 'Yucatán',
      city: 'Mérida',
    };

    const updatedSite = {
      id: 1,
      country: { id: 1, name: 'México', phoneCode: 52 },
      state: 'Yucatán',
      city: 'Valladolid',
    };

    mockSiteService.updateSite.mockImplementation(
      (siteId, countryId, providedSite) => {
        return Promise.resolve(updatedSite as Site);
      }
    );

    const mockReq = getMockReq();
    const { res: mockRes } = getMockRes();

    mockReq.params.id = `${siteId}`;
    mockReq.body = providedSite;

    await siteRouter.routes.updateSite(mockReq, mockRes);

    expect(mockSiteService.updateSite).toHaveBeenCalledTimes(1);

    const { countryId, ...restProvidedSite } = providedSite;

    expect(mockSiteService.updateSite).toHaveBeenCalledWith(
      siteId,
      countryId,
      restProvidedSite
    );

    expect(mockRes.status).toBeCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(updatedSite);
  });
});

describe('deleteSite endpoint', () => {
  test('should return 200 http status when a site is deleted', async () => {
    const siteId = '1';

    mockSiteService.deleteSiteById.mockReturnValueOnce(
      Promise.resolve({} as Site)
    );

    const mockReq = getMockReq();
    const { res: mockRes } = getMockRes();

    mockReq.params.id = siteId;

    await siteRouter.routes.deleteSiteById(mockReq, mockRes);

    expect(mockSiteService.deleteSiteById).toHaveBeenCalledTimes(1);
    expect(mockSiteService.deleteSiteById).toHaveBeenCalledWith(1);
    expect(mockRes.status).toBeCalledWith(200);
  });
});
