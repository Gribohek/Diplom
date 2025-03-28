// src/games/dto/create-game.dto.ts
import { IsString, IsNumber, IsBoolean } from 'class-validator';

export class CreateGameDto {
  @IsString()
  userId: string;

  @IsNumber()
  score: number;

  @IsBoolean()
  completed: boolean;
}
