import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Book } from './entity/book.entity.js';
import { BookCreateReqDto } from './dto/book-create.req.dto.js';

export const UPLOADS_DIR: string = join(process.cwd(), 'uploads');

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
  ) {}

  getBooks(): Promise<Book[]> {
    return this.bookRepository.find();
  }

  async createBook(
    book: BookCreateReqDto,
    image: Express.Multer.File,
  ): Promise<Book> {
    const fileName: string = `${randomUUID()}.${image.mimetype.split('/')[1]}`;
    await mkdir(UPLOADS_DIR, { recursive: true });
    await writeFile(join(UPLOADS_DIR, fileName), image.buffer);
    return this.bookRepository.save({
      title: book.title,
      image: `/uploads/${fileName}`,
    });
  }
}
