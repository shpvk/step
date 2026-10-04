import { PartialType } from '@nestjs/mapped-types';
import { ProductCreateReqDto } from './product_create.req.dto.js';

export class ProductUpdateReqDto extends PartialType(ProductCreateReqDto) {}
