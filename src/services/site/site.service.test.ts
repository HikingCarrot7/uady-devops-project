import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import { Repository } from 'typeorm';
import { Site } from '../../entities/site.entity';
import { SiteService } from './site.service';

let mockSitesRepository: MockProxy<Repository<Site>>;
let siteService: any;

beforeAll(() => {
  mockSitesRepository = mock<Repository<Site>>();
  siteService = SiteService(mockSitesRepository);
});

afterEach(() => {
  mockReset(mockSitesRepository);
});

describe('getAllSites method', () => {
  test('get all sites', async () => {
    mockSitesRepository.find.mockReturnValueOnce(Promise.resolve([]));

    await siteService.getAllSites();

    expect(mockSitesRepository.find).toHaveBeenCalledTimes(1);
  });
});

describe('getSiteById method', () => {
  test('get site with a valid id', async () => {
    const siteId = 1;
    const site = {
      id: 1,
      country: 'Mexico',
      city: 'Merida',
      state: 'Yucatan',
      code: 100,
    } as Site;
    mockSitesRepository.findOne.mockReturnValueOnce(Promise.resolve(site));

    await siteService.getSiteById(siteId);

    expect(mockSitesRepository.findOne).toHaveBeenCalledTimes(1);
    expect(mockSitesRepository.findOne).toHaveBeenCalledWith({ id: siteId});
    expect(mockSitesRepository.findOne).toHaveReturned();    
  });
});

describe('createSite method', () => {
  test('create a new site should work', async () => {
    const providedSite = {
      country: 'Mexico',
      city: 'Caucel',
      state: 'Yucatan',
      code: 101,
    } as Site;

    const newSite = { ...providedSite, id: 3 } as Site;

    mockSitesRepository.save.mockReturnValueOnce(
      Promise.resolve(newSite)
    );

    await siteService.createSite(providedSite);

    expect(mockSitesRepository.save).toHaveBeenCalledWith(
      providedSite
    );
    expect(mockSitesRepository.save).toHaveBeenCalledTimes(1);
    expect(mockSitesRepository.save).toHaveReturned();
  });
});

describe('UpdateSite method', () => {
  test('update site should work', async () => {
    const providedSite = {
      country: 'Mexico',
      city: 'Merida',
      state: 'Yucatan',
      code: 101,
    } as Site;

    const fetchedSite = {
      country: 'Mexico',
      city: 'Merida',
      state: 'Yucatan',
      code: 103,
    } as Site;

    const savedSite = {
      country: 'Mexico',
      city: 'Merida',
      state: 'Yucatan',
      code: 101,
    } as Site;

    mockSitesRepository.save.mockReturnValueOnce(
      Promise.resolve(savedSite)
    );

    mockSitesRepository.findOne.mockReturnValueOnce(
      Promise.resolve(fetchedSite)
    );

    await siteService.updateSite(1, providedSite);

    expect(mockSitesRepository.findOne).toHaveBeenCalledTimes(1);
    expect(mockSitesRepository.findOne).toHaveBeenCalledWith({ id: 1});
    expect(mockSitesRepository.save).toHaveBeenCalledWith(savedSite);
  });
});

describe('deleteSite method', () => {
  test('delete site', async () => {
    const site = {
      id: 2,
      country: 'Mexico',
      city: 'Merida',
      state: 'Yucatan',
      code: 101,
    } as Site;

    mockSitesRepository.findOne.mockReturnValueOnce(
      Promise.resolve(site)
    );

    await siteService.deleteSiteById(site.id);

    expect(mockSitesRepository.findOne).toBeCalledWith({ id: site.id });
    expect(mockSitesRepository.delete).toHaveBeenCalledTimes(1);
    expect(mockSitesRepository.delete).toHaveBeenCalledWith( { id: site.id });
  });
});