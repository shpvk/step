import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity.js';
import { Category } from '../category/entities/category.entity.js';
import { ProductCreateReqDto } from './dtos/product_create.req.dto.js';
import { ProductUpdateReqDto } from './dtos/product_update.req.dto.js';
import { ProductGetResDto } from './dtos/product_get.res.dto.js';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly _repository: Repository<Product>,
    @InjectRepository(Category)
    private readonly _categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<ProductGetResDto[]> {
    const products = await this._repository.find({
      relations: { category: true },
    });
    return products.map((p: Product) => this.toResDto(p));
  }

  async findById(id: number): Promise<ProductGetResDto | undefined> {
    const product = await this._repository.findOne({
      where: { id },
      relations: { category: true },
    });
    if (product) {
      return this.toResDto(product);
    }
  }

  async create(dto: ProductCreateReqDto): Promise<ProductGetResDto> {
    const category = await this.getCategory(dto.category_id);
    const product = this._repository.create({
      title: dto.title,
      price: dto.price,
      description: dto.description ?? null,
      category,
    });
    const result = await this._repository.save(product);
    return this.toResDto(result);
  }

  async update(
    id: number,
    dto: ProductUpdateReqDto,
  ): Promise<ProductGetResDto | undefined> {
    const product = await this._repository.findOne({
      where: { id },
      relations: { category: true },
    });
    if (product) {
      if (dto.category_id !== undefined) {
        product.category = await this.getCategory(dto.category_id);
      }
      product.title = dto.title ?? product.title;
      product.price = dto.price ?? product.price;
      product.description = dto.description ?? product.description;
      const result = await this._repository.save(product);
      return this.toResDto(result);
    }
  }

  async remove(id: number): Promise<ProductGetResDto | undefined> {
    const product = await this.findById(id);
    if (product) {
      await this._repository.delete(id);
    }
    return product;
  }

  private async getCategory(id: number): Promise<Category> {
    const category = await this._categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  private toResDto(product: Product): ProductGetResDto {
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      description: product.description,
      category_id: product.category.id,
    };
  }
}
