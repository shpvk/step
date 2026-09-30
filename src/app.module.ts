import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { CategoryModule } from './category/category.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookModule } from './book/book.module.js';
@Module({
  imports:
  
  [
  TypeOrmModule.forRoot({
    type:'postgres',
    host:'localhost',
    port:27544  ,
    username:'avnadmin',
    password:'123456',
    database:'defaultdb',
    autoLoadEntities : true,
    synchronize: true
  }),
  CategoryModule,
  BookModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
