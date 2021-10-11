import { getMockReq, getMockRes } from '@jest-mock/express';
import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import { Site } from '../../entities/site.entity';
import { SiteService } from '../../services/site/site.service';
import { invalidIdMsg, isValidId } from '../../utils/validateId';
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
    expect(mockRes.json).toHaveBeenCalledWith({'sites': []});
  });

  test('get all sites should return 500 http status if typeorm can´t connect to mysql', async () => {
    mockSiteService.getAllSites.mockReturnValueOnce(Promise.reject({}));

    const mockReq = getMockReq();
    const { res: mockRes } = getMockRes();

    await siteRouter.routes.getAllSites(mockReq, mockRes);

    expect(mockSiteService.getAllSites).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({error: {}});
  });  
});

describe('getSiteById endpoint', () => {
  test('should return 200 http status code if the site exists', async () => {
    const siteId = '1';

    const site = {
      id: parseInt(siteId),
      country: 'Mexico',
      city: 'Merida',
      state: 'Yucatan',
    };

    mockSiteService.getSiteById.mockImplementation(
      async (siteId) => {
        if (!isValidId(siteId)) {
          return Promise.reject(invalidIdMsg(siteId));
        }

        if (siteId == site.id)
          return Promise.resolve(site as Site);

        return Promise.resolve(null as unknown as Site);
      }
    );

    const mockReq = getMockReq();
    const { res: mockRes } = getMockRes();

    mockReq.params.id = siteId;

    await siteRouter.routes.getSiteById(mockReq, mockRes);

    expect(mockSiteService.getSiteById).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(200);
    expect(mockRes.json).toBeCalledWith({site});
  });

  test('should return 400 http status code if the site id is invalid', async () => {
    const siteId = 'abc';

    const site = {
      id: 1,
      country: 'Mexico',
      city: 'Merida',
      state: 'Yucatan',
    };

    mockSiteService.getSiteById.mockImplementation(
      async (siteId) => {
        if (!isValidId(siteId)) {
          return Promise.reject(invalidIdMsg(siteId));
        }

        if (siteId == site.id)
          return Promise.resolve(site as Site);

        return Promise.resolve(null as unknown as Site);
      }
    );

    const mockReq = getMockReq();
    const { res: mockRes } = getMockRes();

    mockReq.params.id = siteId;

    await siteRouter.routes.getSiteById(mockReq, mockRes);

    expect(mockSiteService.getSiteById).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(400);
    expect(mockRes.json).toBeCalledWith({ 'error': invalidIdMsg(siteId)});
  });
});

describe('createSite endpoint', () => {
  test('should return 201 http status code when new site is created', async () => {
    const reqBody = {
      country: 'Mexico',
      city: 'Merida',
      state: 'Yucatan',
    };

    mockSiteService.createSite.mockImplementation(
      () => {
        return Promise.resolve({
          id: 1,
          ...reqBody,
        } as unknown as Site);
      }
    );

    const mockReq = getMockReq();
    const { res: mockRes } = getMockRes();

    mockReq.body = reqBody;

    await siteRouter.routes.createSite(mockReq, mockRes);

    expect(mockSiteService.createSite).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({ site: {id: 1, ...reqBody} });
  });  
});

describe('updateSite endpoint', () => {
  test('should return 200 http status code when a site is updated', async () => {
    const siteId = '1';

    const reqBody = {
      country: 'United States',
    };

    const originalSite = {
      id: parseInt(siteId),
      country: 'Mexico',
      city: 'Merida',
      state: 'Yucatan',
    };

    const updatedSite = {
      id: parseInt(siteId),
      country: 'United States',
      city: 'Merida',
      state: 'Yucatan',
    };

    mockSiteService.updateSite.mockImplementation(
      (siteId, newSite) => {
        return Promise.resolve({...originalSite, ...newSite} as Site);
      }
    );

    const mockReq = getMockReq();
    const { res: mockRes } = getMockRes();

    mockReq.params.id = siteId;
    mockReq.body = reqBody;

    await siteRouter.routes.updateSite(mockReq, mockRes);

    expect(mockSiteService.updateSite).toHaveBeenCalledTimes(1);
    expect(mockSiteService.updateSite).toHaveBeenCalledWith(
      siteId,
      reqBody
    );
    expect(mockRes.status).toBeCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({site: updatedSite});
  });
});

describe('deleteSite endpoint', () => {
  test('should return 200 http status when a site is deleted', async () => {
    const siteId = '1';

    mockSiteService.deleteSiteById.mockRejectedValueOnce({});

    const mockReq = getMockReq();
    const { res: mockRes } = getMockRes();

    mockReq.params.id = siteId;

    await siteRouter.routes.deleteSiteById(mockReq, mockRes);

    expect(mockSiteService.deleteSiteById).toHaveBeenCalledTimes(1);
    expect(mockSiteService.deleteSiteById).toHaveBeenCalledWith(siteId);
    expect(mockRes.status).toBeCalledWith(200);
  });
});