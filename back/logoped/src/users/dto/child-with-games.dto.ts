// src/users/dto/child-with-games.dto.ts
import { Game } from '../entities/game.entity';

export class ChildWithGamesDto {
  id: string;
  userame: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  games: Game[];
}
