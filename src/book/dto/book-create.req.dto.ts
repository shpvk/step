import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class BookCreateReqDto {
  @IsString({ message: 'Поле должно быть строкой' })
  @IsNotEmpty({ message: 'Поле не должно быть пустое' })
  @MaxLength(100, { message: 'Поле должно быть не больше 100 символов' })
  title: string;
}
