import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { User } from '@prisma/client';
import { UpdateChildDto } from '../dto/update-child.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllChildren(): Promise<
    {
      id: number;
      firstName: string;
      lastName: string;
      middleName: string;
      title: string;
      score: number;
      completed: boolean;
    }[]
  > {
    const children = await this.prisma.user.findMany({
      where: {
        role: 'CHILD',
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        middleName: true,
        title: true,
        score: true,
        completed: true,
        // Здесь не выбираем username, password, role и title, так как они не нужны
      },
    });

    // Преобразуем в правильный формат
    return children.map((child) => ({
      id: child.id,
      firstName: child.firstName,
      lastName: child.lastName,
      middleName: child.middleName,
      title: child.title,
      score: child.score ?? 0, // Установка значения по умолчанию, если `score` отсутствует
      completed: child.completed,
    }));
  }
  async deleteChild(id: number): Promise<void> {
    await this.prisma.user.delete({
      where: { id }, // Убедитесь, что столбец id присутствует в вашей базе данных
    });
  }

  // Метод для обновления данных о ребенке
  async updateChild(id: number, updateChildDto: UpdateChildDto) {
    await this.prisma.user.update({
      where: { id },
      data: updateChildDto,
    });
    return {};
  }
}
