import { Module } from '@nestjs/common';
import { UserService } from './user.service.js';
import { UserController } from './user.controller.js';
import { User } from './entities/user.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashHelper } from '../helpers/hash.helper.js';
import { Role } from '../role/entities/role.entity.js';
import { City } from './entities/city.entity.js';
import { Country } from './entities/country.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, City, Country])],
  controllers: [UserController],
  providers: [UserService, HashHelper],
  exports: [UserService],
})
export class UserModule {}
