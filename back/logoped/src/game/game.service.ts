import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'; // Импортируйте ваш PrismaService
import { Game } from './game.model';
import { UpdateGameDto } from './dto/update-game.dto';

@Injectable()
export class GameService {
  constructor(private readonly prisma: PrismaService) {}

  async addGame(game): Promise<Game> {
    return this.prisma.game.create({
      data: {
        title: game.title, // Убедитесь, что это поле присутствует
        score: game.score || 0, // или другое начальное значение
        completed: game.completed,
        user: {
          // Связываем игру с пользователем
          connect: {
            id: game.userId, // userId должен быть передан
          },
        },
      },
    });
  }
  async getUserGames(userId: string) {
    return this.prisma.game.findMany({
      where: {
        userId: userId,
      },
    });
  }

  // Метод для добавления новой игры

  // Метод для обновления счета игры
  async updateGame(gameId: string, updateGameDto: UpdateGameDto) {
    // Здесь использую метод findUnique для поиска игры по ID
    const game = await this.prisma.game.findUnique({
      where: { id: gameId },
    });

    // Если игра не найдена, выбрасываем исключение

    // Обновляем данные игры с помощью метода update
    const updatedGame = await this.prisma.game.update({
      where: { id: gameId },
      data: updateGameDto,
    });

    return updatedGame; // Возвращаем обновлённую игру
  }
}
