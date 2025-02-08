import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdateChildDto } from '../dto/update-child.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(AuthGuard('jwt')) // Защита маршрута, чтобы только авторизованные пользователи могли получить доступ
  @Get('children') // Путь для получения всех пользователей (детей)
  async getAllChildren() {
    return this.adminService.getAllChildren();
  }
  // Метод для удаления ребенка по ID
  @UseGuards(AuthGuard('jwt'))
  @Delete('children/:id')
  async deleteChild(@Param('id') id: string): Promise<void> {
    return this.adminService.deleteChild(+id);
  }

  // Метод для обновления данных ребенка
  @UseGuards(AuthGuard('jwt'))
  @Put('children/:id')
  async updateChild(
    @Param('id') id: string,
    @Body() updateChildDto: UpdateChildDto,
  ) {
    return this.adminService.updateChild(+id, updateChildDto);
  }
}
