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
import { UpdateChildDto } from './dto/update-child.dto';

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
    return this.usersService.findUserById(user.userId);
  }
  @UseGuards(AuthGuard('jwt')) // Используем Guard для защиты роутов
  @Get('game')
  async getGsme(@Request() req) {
    const user = req.user;
    return this.usersService.getUserGames(user.userId);
  }
  @UseGuards(AuthGuard('jwt'))
  @Delete('me') // Эндпоинт для удаления текущего пользователя
  async deleteMe(@Request() request) {
    const user = request.user;
    return this.usersService.deleteUser(user.userId);
  }
  @UseGuards(AuthGuard('jwt'))
  @Put('me') // Эндпоинт для обновления текущего пользователя
  async updateMe(@Request() request, @Body() updateData: UpdateUserDto) {
    const user = request.user;
    return this.usersService.updateUser(user.userId, updateData);
  }
  @Get('children')
  async getChildrenWithGames() {
    return this.usersService.findAllChildrenWithGames();
  }
  @Put('children/:id')
  async updateChild(
    @Param('id') id: string,
    @Body() updateChildDto: UpdateChildDto,
  ) {
    return this.usersService.updateChild(id, updateChildDto);
  }
  @Delete('children/:id')
  async deleteChild(@Param('id') id: string) {
    return this.usersService.deleteChild(id);
  }
}
