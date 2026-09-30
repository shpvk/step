import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'node:crypto';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Book } from './entity/book.entity.js';
import { BookCreateReqDto } from './dto/book-create.req.dto.js';
import { BookUpdateReqDto } from './dto/book-update.req.dto.js';

export const UPLOADS_DIR: string = join(process.cwd(), 'uploads');
const UPLOADS_PREFIX: string = '/uploads/';

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
    return this.bookRepository.save({
      title: book.title,
      image: await this.saveImage(image),
    });
  }

  async updateBook(
    id: number,
    book: BookUpdateReqDto,
    image: Express.Multer.File | undefined,
  ): Promise<Book | null> {
    const existingBook: Book | null = await this.bookRepository.findOneBy({
      id,
    });
    if (existingBook === null) {
      return null;
    }
    if (book.title !== undefined) {
      existingBook.title = book.title;
    }
    if (image !== undefined) {
      const oldImage: string = existingBook.image;
      existingBook.image = await this.saveImage(image);
      await this.removeImage(oldImage);
    }
    return this.bookRepository.save(existingBook);
  }

  private async saveImage(image: Express.Multer.File): Promise<string> {
    const fileName: string = `${randomUUID()}.${image.mimetype.split('/')[1]}`;
    await mkdir(UPLOADS_DIR, { recursive: true });
    await writeFile(join(UPLOADS_DIR, fileName), image.buffer);
    return `${UPLOADS_PREFIX}${fileName}`;
  }

  private async removeImage(imagePath: string): Promise<void> {
    await rm(join(UPLOADS_DIR, imagePath.slice(UPLOADS_PREFIX.length)), {
      force: true,
    });
  }
}
