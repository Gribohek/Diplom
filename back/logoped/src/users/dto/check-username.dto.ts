// src/auth/dto/check-username.dto.ts
import { IsString } from 'class-validator';

export class CheckUsernameDto {
  @IsString()
  username: string;
}
