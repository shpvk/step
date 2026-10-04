import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ProductService } from './product.service.js';
import { ProductCreateReqDto } from './dtos/product_create.req.dto.js';
import { ProductUpdateReqDto } from './dtos/product_update.req.dto.js';
import { ProductGetResDto } from './dtos/product_get.res.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAllProducts(): Promise<ProductGetResDto[]> {
    return await this.productService.findAll();
  }

  @Get(':id')
  async getProductById(@Param('id') id: string): Promise<ProductGetResDto> {
    const product = await this.productService.findById(+id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  @Roles('admin')
  @Post()
  async createProduct(
    @Body() product: ProductCreateReqDto,
  ): Promise<ProductGetResDto> {
    return await this.productService.create(product);
  }

  @Roles('admin')
  @Put(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() product: ProductCreateReqDto,
  ): Promise<ProductGetResDto> {
    const updated = await this.productService.update(+id, product);
    if (!updated) {
      throw new NotFoundException('Product not found');
    }
    return updated;
  }

  @Roles('admin')
  @Patch(':id')
  async patchProduct(
    @Param('id') id: string,
    @Body() product: ProductUpdateReqDto,
  ): Promise<ProductGetResDto> {
    const updated = await this.productService.update(+id, product);
    if (!updated) {
      throw new NotFoundException('Product not found');
    }
    return updated;
  }

  @Roles('admin')
  @Delete(':id')
  async deleteProduct(@Param('id') id: string): Promise<ProductGetResDto> {
    const deleted = await this.productService.remove(+id);
    if (!deleted) {
      throw new NotFoundException('Product not found');
    }
    return deleted;
  }
}
