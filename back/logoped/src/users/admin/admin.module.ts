import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PrismaService } from '../../prisma.service'; // Импортируйте ваш сервис Prisma для работы с базой данных

@Module({
  imports: [],
  controllers: [AdminController], // Регистрация контроллера
  providers: [AdminService, PrismaService], // Регистрация сервиса и Prisma
})
export class AdminModule {}
