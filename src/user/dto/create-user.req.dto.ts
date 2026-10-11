import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserReqDto {
  @IsEmail(
    {},
    {
      message: 'Це не email',
    },
  )
  email: string;

  @IsString()
  @MinLength(5, { message: 'Пароль мінімум 5 символів' })
  password: string;

  @IsString()
  @MinLength(2, { message: 'Ім’я мінімум 2 символи' })
  fullname: string;

  @IsOptional()
  @IsBoolean()
  is_block?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'Адреса максимум 200 символів' })
  address?: string;

  @IsOptional()
  @IsInt({ message: 'Місто має бути числом' })
  city_id?: number;
}
