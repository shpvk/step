import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/product/:id')
  getProductById(@Param('id') id: string): string {
    return `Hello from Nest! Your id: ${+id}`;
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  
}
