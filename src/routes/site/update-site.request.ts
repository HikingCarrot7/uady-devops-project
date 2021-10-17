import { IsOptional } from 'class-validator';
import { SiteRequest } from './site.request';

export class UpdateSiteRequest extends SiteRequest {
  @IsOptional()
  countryId: number;

  @IsOptional()
  state: string;

  @IsOptional()
  city: string;
}
