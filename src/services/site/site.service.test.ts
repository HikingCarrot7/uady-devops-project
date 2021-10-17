import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import { Repository } from 'typeorm';
import { Country } from '../../entities/country.entity';
import { Site } from '../../entities/site.entity';
import { SiteService } from './site.service';

let mockSiteRepository: MockProxy<Repository<Site>>;
let mockCountryRepository: MockProxy<Repository<Country>>;
let siteService: any;

beforeAll(() => {
  mockSiteRepository = mock<Repository<Site>>();
  mockCountryRepository = mock<Repository<Country>>();
  siteService = new SiteService(mockSiteRepository, mockCountryRepository);
});

afterEach(() => {
  mockReset(mockSiteRepository);
});

describe('getAllSites method', () => {
  test('get all sites', async () => {
    mockSiteRepository.find.mockReturnValueOnce(Promise.resolve([]));

    await siteService.getAllSites();

    expect(mockSiteRepository.find).toHaveBeenCalledTimes(1);
  });
});

describe('getSiteById method', () => {
  test('get site with a valid id', async () => {
    const siteId = 1;
    const site = {
      id: 1,
      country: { id: 1, name: 'México', phoneCode: 52 },
      state: 'Yucatán',
      city: 'Mérida',
    } as Site;

    mockSiteRepository.findOne.mockReturnValueOnce(Promise.resolve(site));

    await siteService.getSiteById(siteId);

    expect(mockSiteRepository.findOne).toHaveBeenCalledTimes(1);
    expect(mockSiteRepository.findOne).toHaveBeenCalledWith({ id: siteId });
    expect(mockSiteRepository.findOne).toHaveReturned();
  });
});

describe('createSite method', () => {
  test('create a new site should work', async () => {
    const fetchedCountry = {
      id: 1,
      name: 'México',
      phoneCode: 52,
    } as Country;

    const providedSite = {
      countryId: 1,
      state: 'Yucatán',
      city: 'Caucel',
    };

    const newSite = {
      ...providedSite,
      id: 3,
      country: fetchedCountry,
    } as unknown as Site;

    mockSiteRepository.save.mockReturnValue(Promise.resolve(newSite));
    mockCountryRepository.findOne.mockReturnValue(
      Promise.resolve(fetchedCountry)
    );

    await siteService.createSite(providedSite.countryId, providedSite);

    expect(mockSiteRepository.save).toHaveBeenCalledWith(providedSite);
    expect(mockSiteRepository.save).toHaveBeenCalledTimes(1);
    expect(mockSiteRepository.save).toHaveReturned();
  });
});

describe('UpdateSite method', () => {
  test('update site should work', async () => {
    const providedSite = {
      country: { id: 1, name: 'México', phoneCode: 52 },
      state: 'Yucatán',
      city: 'Mérida',
    } as Site;

    const fetchedSite = {
      country: { id: 1, name: 'México', phoneCode: 52 },
      state: 'Yucatán',
      city: 'Valladolid',
    } as Site;

    const savedSite = {
      country: { id: 1, name: 'México', phoneCode: 52 },
      state: 'Yucatán',
      city: 'Mérida',
    } as Site;

    mockSiteRepository.save.mockReturnValueOnce(Promise.resolve(savedSite));
    mockSiteRepository.findOne.mockReturnValue(Promise.resolve(fetchedSite));

    await siteService.updateSite(1, providedSite);

    expect(mockSiteRepository.findOne).toHaveBeenCalledTimes(2);
    expect(mockSiteRepository.findOne).toHaveBeenCalledWith({ id: 1 });
    expect(mockSiteRepository.save).toHaveBeenCalledWith({
      ...providedSite,
      ...fetchedSite,
    });
  });
});

describe('deleteSite method', () => {
  test('delete site', async () => {
    const site = {
      id: 1,
      country: { id: 1, name: 'México', phoneCode: 52 },
      state: 'Yucatán',
      city: 'Mérida',
    } as Site;

    mockSiteRepository.findOne.mockReturnValueOnce(Promise.resolve(site));

    await siteService.deleteSiteById(site.id);

    expect(mockSiteRepository.delete).toHaveBeenCalledTimes(1);
    expect(mockSiteRepository.delete).toHaveBeenCalledWith({ id: site.id });
  });
});
