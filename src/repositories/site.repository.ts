import { EntityRepository, Repository } from 'typeorm';
import { Site } from '../entities/site.entity';

@EntityRepository(Site)
export class SiteRepository extends Repository<Site> {}