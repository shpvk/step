import { PartialType } from '@nestjs/mapped-types';
import { BookCreateReqDto } from './book-create.req.dto.js';

export class BookUpdateReqDto extends PartialType(BookCreateReqDto) {}
