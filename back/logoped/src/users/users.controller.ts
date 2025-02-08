import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Request,
  Put,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() data: Omit<User, 'id'>) {
    return this.usersService.create(data);
  }

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.usersService.createUser(registerDto);
    return { message: 'User registered successfully', userId: user.id };
  }
  @UseGuards(AuthGuard('jwt')) // Используем Guard для защиты роутов
  @Get('me') // Эндпоинт для получения текущего пользователя
  async getMe(@Request() req) {
    const user = req.user;
    return this.usersService.findUserById(user.userId); // Предполагается, что идентификатор пользователя находится в req.user
  }
  @UseGuards(AuthGuard('jwt'))
  @Delete('me') // Эндпоинт для удаления текущего пользователя
  async deleteMe(@Request() request) {
    const user = request.user;
    return this.usersService.deleteUser(user.userId); // вы должны реализовать метод deleteUserById в вашем сервисе
  }
  @UseGuards(AuthGuard('jwt'))
  @Put('me') // Эндпоинт для обновления текущего пользователя
  async updateMe(@Request() request, @Body() updateData: UpdateUserDto) {
    const user = request.user;
    return this.usersService.updateUser(user.userId, updateData); // Метод должен быть реализован
  }
  @Get()
  @UseGuards(AuthGuard('jwt')) // Применяем защитник для проверки токена
  async getUsers(@Query('role') role: string) {
    return this.usersService.findByRole(role);
  }
}
