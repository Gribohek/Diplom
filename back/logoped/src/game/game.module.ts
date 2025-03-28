// src/games/game.module.ts

import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { PrismaService } from '../prisma.service'; // Импортируйте ваш PrismaService

@Module({
  controllers: [GameController],
  providers: [GameService, PrismaService], // Добавьте PrismaService в провайдеры
})
export class GameModule {}
