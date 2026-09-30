import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  NotFoundException,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BookService } from './book.service.js';
import { Book } from './entity/book.entity.js';
import { BookCreateReqDto } from './dto/book-create.req.dto.js';
import { BookUpdateReqDto } from './dto/book-update.req.dto.js';

const IMAGE_TYPE_VALIDATOR: FileTypeValidator = new FileTypeValidator({
  fileType: /^image\/(png|jpeg|gif|webp)$/,
  overrideMimeType: true,
});

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
    @UploadedFile(new ParseFilePipe({ validators: [IMAGE_TYPE_VALIDATOR] }))
    image: Express.Multer.File,
  ): Promise<Book> {
    return this.bookService.createBook(book, image);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async updateBook(
    @Param('id') id: string,
    @Body() book: BookUpdateReqDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [IMAGE_TYPE_VALIDATOR],
        fileIsRequired: false,
      }),
    )
    image: Express.Multer.File | undefined,
  ): Promise<Book> {
    const updatedBook: Book | null = await this.bookService.updateBook(
      +id,
      book,
      image,
    );
    if (updatedBook === null) {
      throw new NotFoundException('Book not found');
    }
    return updatedBook;
  }
}
