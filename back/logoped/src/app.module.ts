// app.module.ts
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma.service'; // Убедитесь, что путь правильный
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './users/admin/admin.module';

@Module({
  imports: [UsersModule, AuthModule, AdminModule],
  providers: [PrismaService],
})
export class AppModule {}
