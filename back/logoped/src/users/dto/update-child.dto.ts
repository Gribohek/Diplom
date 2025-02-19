import { UserRole } from '@prisma/client';
// update-child.dto.ts
import { IsString, IsOptional, IsEnum } from 'class-validator';

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

  @IsString()
  @IsOptional()
  role?: any;
}
