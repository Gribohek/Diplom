// update-child.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class UpdateChildDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  middleName?: string;
}
