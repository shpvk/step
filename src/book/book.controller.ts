import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BookService } from './book.service.js';
import { Book } from './entity/book.entity.js';
import { BookCreateReqDto } from './dto/book-create.req.dto.js';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  getAllBooks(): Promise<Book[]> {
    return this.bookService.getBooks();
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  createBook(
    @Body() book: BookCreateReqDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: /^image\/(png|jpeg|gif|webp)$/,
            overrideMimeType: true,
          }),
        ],
      }),
    )
    image: Express.Multer.File,
  ): Promise<Book> {
    return this.bookService.createBook(book, image);
  }
}
