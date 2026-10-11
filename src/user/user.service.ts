import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserReqDto } from './dto/create-user.req.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { HashHelper } from '../helpers/hash.helper.js';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { Repository } from 'typeorm';
import { GetUserResDto } from './dto/get-user.res.dto.js';
import { City } from './entities/city.entity.js';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly _repository: Repository<User>,
    private readonly _hashHelper: HashHelper,
    @InjectRepository(City)
    private readonly _cityRepository: Repository<City>,
  ) {}

  async create(createUserDto: CreateUserReqDto) {
    const user = await this._repository.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    if (user != null) {
      throw new ConflictException('Користувач з таким email вже існує');
    }

    if (createUserDto.city_id !== undefined) {
      await this.checkCity(createUserDto.city_id);
    }

    const hash = await this._hashHelper.hash(createUserDto.password);
    const result = this._repository.create({
      fullname: createUserDto.fullname,
      email: createUserDto.email,
      is_block: createUserDto.is_block,
      password_hash: hash,
      address: createUserDto.address,
      city_id: createUserDto.city_id,
      role: { id: 2 },
    });
    const savedUser = await this._repository.save(result);

    return {
      id: savedUser.id,
      email: savedUser.email,
      fullname: savedUser.fullname,
      is_block: savedUser.is_block,
      address: savedUser.address,
      city_id: savedUser.city_id,
    };
  }

  async validateCredentials(email: string, password: string) {
    const user = await this._repository.findOne({ where: { email } });
    if (!user || user.is_block) {
      return null;
    }

    const isValid = await this._hashHelper.isValidPassword(
      password,
      user.password_hash,
    );
    return isValid ? { id: user.id, email: user.email } : null;
  }

  async hasRole(userId: number, roleName: string): Promise<boolean> {
    const user = await this._repository.findOne({
      where: { id: userId },
      relations: { role: true },
    });

    return user?.role?.name === roleName;
  }

  async findAll(): Promise<GetUserResDto[]> {
    const users: User[] = await this._repository.find();
    const result: GetUserResDto[] = [];
    users.forEach((user: User) => {
      result.push(this.toResDto(user));
    });
    return result;
  }

  async findOne(id: number): Promise<GetUserResDto | null> {
    const user: User | null = await this._repository.findOneBy({ id });
    if (user === null) {
      return null;
    }
    return this.toResDto(user);
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<GetUserResDto | null> {
    const user: User | null = await this._repository.findOneBy({ id });
    if (user === null) {
      return null;
    }
    if (
      updateUserDto.email !== undefined &&
      updateUserDto.email !== user.email
    ) {
      const existingUser: User | null = await this._repository.findOneBy({
        email: updateUserDto.email,
      });
      if (existingUser !== null) {
        throw new ConflictException('Користувач з таким email вже існує');
      }
      user.email = updateUserDto.email;
    }
    if (updateUserDto.password !== undefined) {
      user.password_hash = await this._hashHelper.hash(updateUserDto.password);
    }
    if (updateUserDto.fullname !== undefined) {
      user.fullname = updateUserDto.fullname;
    }
    if (updateUserDto.is_block !== undefined) {
      user.is_block = updateUserDto.is_block;
    }
    if (updateUserDto.address !== undefined) {
      user.address = updateUserDto.address;
    }
    if (updateUserDto.city_id !== undefined) {
      await this.checkCity(updateUserDto.city_id);
      user.city_id = updateUserDto.city_id;
    }
    const result: User = await this._repository.save(user);
    return this.toResDto(result);
  }

  async remove(id: number): Promise<GetUserResDto | null> {
    const user: GetUserResDto | null = await this.findOne(id);
    if (user !== null) {
      await this._repository.delete(id);
    }
    return user;
  }

  private toResDto(user: User): GetUserResDto {
    return {
      id: user.id,
      email: user.email,
      fullname: user.fullname,
      is_block: user.is_block,
      address: user.address,
      city_id: user.city_id,
    };
  }

  private async checkCity(id: number): Promise<void> {
    const city: City | null = await this._cityRepository.findOneBy({ id });
    if (city === null) {
      throw new NotFoundException('Місто не знайдено');
    }
  }
}
