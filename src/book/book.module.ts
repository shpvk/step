import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookService } from './book.service.js';
import { BookController } from './book.controller.js';
import { Book } from './entity/book.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Book])],
  controllers: [BookController],
  providers: [BookService],
  exports: [],
})
export class BookModule {}
