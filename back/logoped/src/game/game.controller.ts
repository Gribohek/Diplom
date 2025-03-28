import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { GameService } from './game.service';
import { Game } from './game.model'; // Импортируйте вашу модель Game
import { UpdateGameDto } from './dto/update-game.dto';
@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  async createGame(@Body() gameData: Game) {
    return this.gameService.addGame(gameData);
  }
  @Get('user/:userId')
  getUserGames(@Param('userId') userId: string) {
    return this.gameService.getUserGames(userId);
  }

  @Put(':gameId')
  async updateGame(
    @Param('gameId') gameId: string,
    @Body() updateGameDto: UpdateGameDto,
  ) {
    return this.gameService.updateGame(gameId, updateGameDto);
  }
}
