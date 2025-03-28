// app.module.ts
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma.service'; // Убедитесь, что путь правильный
import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [UsersModule, AuthModule, GameModule],
  providers: [PrismaService],
})
export class AppModule {}
