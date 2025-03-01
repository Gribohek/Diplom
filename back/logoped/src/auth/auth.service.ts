import { Auth } from './entities/auth.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service';

type AuthInput = { username: string; password: string };
type SignInData = { id: string; username: string };
type AuthResult = { accessToken: string; id: string; username: string };

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async authenticate(input: AuthInput) {
    const user = await this.userService.findUserByName(input.username);
    if (user && (await bcrypt.compare(input.password, user.password))) {
      return {
        id: user.id,
        username: user.username,
      };
    }

    return null;
  }

  async validateUser(input: AuthInput) {
    const user = await this.userService.findUserByName(input.username);
    if (user && (await bcrypt.compare(input.password, user.password))) {
      return {
        id: user.id,
        username: user.username,
      };
    }
    return null;
  }

  async singIn(user: SignInData) {
    const tokenPayLoad = {
      sub: user.id,
      username: user.username,
    };
    const accessToken = await this.jwtService.signAsync(tokenPayLoad);
    return { accessToken, username: user.username, id: user.id };
  }

  async register(registerUserDto: RegisterUserDto) {
    const { firstName, lastName, middleName, username, password, role } =
      registerUserDto;

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10); // 10 - это количество раундов хеширования

    const newUser = await this.prisma.user.create({
      data: {
        firstName,
        lastName,
        middleName,
        username,
        password: hashedPassword, // Сохраняем хешированный пароль
        role,
      },
    });

    return newUser;
  }

  async checkUsername(username: string): Promise<boolean> {
    const user = await this.prisma.user.findFirst({ where: { username } });
    return !!user; // Возвращаем true, если пользователь найден
  }
}
