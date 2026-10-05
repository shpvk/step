import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service.js';
import { CreateUserReqDto } from './dto/create-user.req.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { GetUserResDto } from './dto/get-user.res.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles('admin')
  @Post()
  create(@Body() createUserDto: CreateUserReqDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll(): Promise<GetUserResDto[]> {
    return await this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<GetUserResDto> {
    const user: GetUserResDto | null = await this.userService.findOne(+id);
    if (user === null) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Roles('admin')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<GetUserResDto> {
    const updated: GetUserResDto | null = await this.userService.update(
      +id,
      updateUserDto,
    );
    if (updated === null) {
      throw new NotFoundException('User not found');
    }
    return updated;
  }

  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<GetUserResDto> {
    const deleted: GetUserResDto | null = await this.userService.remove(+id);
    if (deleted === null) {
      throw new NotFoundException('User not found');
    }
    return deleted;
  }
}
