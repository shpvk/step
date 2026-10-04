import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class ProductCreateReqDto {
  @MinLength(2, { message: 'Min: 2!' })
  @MaxLength(50, { message: 'Max: 50!' })
  @IsString({ message: 'Title must be string!' })
  title: string;

  @IsNumber({}, { message: 'Price must be a number!' })
  @Min(0, { message: 'Price cannot be negative!' })
  price: number;

  @IsOptional()
  @IsString({ message: 'Description must be string!' })
  description?: string;

  @IsInt({ message: 'Category ID must be an integer!' })
  @Min(1, { message: 'Category ID must be greater than 0!' })
  category_id: number;
}
