import { PartialType } from '@nestjs/mapped-types';
import { CategoryCreateReqDto } from './category_create.req.dto.js';

export class CategoryUpdateReqDto extends PartialType(CategoryCreateReqDto) {}
