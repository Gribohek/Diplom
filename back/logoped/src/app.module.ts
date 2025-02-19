// app.module.ts
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma.service'; // Убедитесь, что путь правильный
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, AuthModule],
  providers: [PrismaService],
})
export class AppModule {}
