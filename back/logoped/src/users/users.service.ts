import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';
import { UpdateChildDto } from './dto/update-child.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Omit<User, 'id'>) {
    return this.prisma.user.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async deleteUser(id: string): Promise<User> {
    // Сначала удалим все игры, связанные с пользователем
    await this.prisma.game.deleteMany({
      where: { userId: id },
    });

    // Затем удалим пользователя
    return this.prisma.user.delete({
      where: { id },
    });
  }
  async updateUser(id: string, data: Partial<User>) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async findUserByName(username: string) {
    return await this.prisma.user.findFirst({
      where: { username },
    });
  }
  async findUserByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async createUser(registerDto: RegisterDto) {
    const { firstName, lastName, middleName, username, password } = registerDto;

    const existingUser = await this.findUserByUsername(username);
    if (existingUser) {
      throw new ConflictException('Username already taken');
    }

    return this.prisma.user.create({
      data: {
        firstName,
        lastName,
        middleName,
        username,
        password,
        role: UserRole.CHILD, // Установите роль по умолчанию
      },
    });
  }
  async findUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        middleName: true,
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  async getUserGames(id: string) {
    const userWithGames = await this.prisma.user.findUnique({
      where: { id },
      include: { games: true },
    });
    return userWithGames?.games || []; // Возвращает список игр
  }
  async findAllChildrenWithGames() {
    const children = await this.prisma.user.findMany({
      where: { role: 'CHILD' }, // Фильтруем по роли
      include: { games: true }, // Загружаем связанные игры
    });

    return children.map((child) => ({
      id: child.id,
      userName: child.username,
      firstName: child.firstName,
      lastName: child.lastName,
      middleName: child.middleName,
      games: child.games, // Связанные игры
    }));
  }
  async updateChild(id: string, updateChildDto: UpdateChildDto) {
    const user = await this.prisma.user.update({
      where: { id },
      data: updateChildDto,
    });
    console.log(await this.findAllChildrenWithGames());
    return await this.findAllChildrenWithGames();
  }

  async deleteChild(id: string): Promise<void> {
    const child = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!child) {
      throw new HttpException('Child not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.$transaction(async (prisma) => {
      await prisma.game.deleteMany({
        where: { userId: id },
      });

      await prisma.user.delete({
        where: { id },
      });
    });
  }
}
