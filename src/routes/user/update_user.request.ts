import { IsOptional } from 'class-validator';
import { UserRequest } from './user.request';

export class UpdateUserRequest extends UserRequest {
  @IsOptional()
  username: string;

  @IsOptional()
  email: string;

  @IsOptional()
  password: string;
}
