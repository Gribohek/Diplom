import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateGameDto {
  @IsNumber()
  score: number;
}
