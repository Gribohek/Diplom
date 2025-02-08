import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';

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

  async deleteUser(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return this.prisma.user.delete({
      where: { id },
    });
  }
  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

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
  async findUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        middleName: true,
        title: true,
        score: true,
        role: true,
        completed: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }
  async findByRole(role: string) {
    return this.prisma.user.findMany({
      where: { role: 'CHILD' },
    });
  }
}
