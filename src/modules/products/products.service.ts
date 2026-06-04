import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from 'src/modules/products/products.repository';
import {  ShopsService } from 'src/modules/shops/shops.service';
import { ProductDTO } from 'src/modules/products/dto/product.dto';
import { AppLogger } from 'src/common/logger/logger';
import { CreateProductDTO } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly repository: ProductsRepository,private readonly shopService: ShopsService, private readonly logger: AppLogger) {}
  async create(product: CreateProductDTO): Promise<ProductDTO> {
    this.logger.log('Creating a new product', 'ProductsService');
    const shopId =product.shopId;
    const shop = await this.shopService.findOne(shopId);
    if(!shop){
      throw new NotFoundException('Shop not found, cannot create product');
    }
    return this.repository.create(product);
  }
  async findWithFilter(filter: Partial<ProductDTO>): Promise<ProductDTO[]> {

    return this.repository.findWithFilter(filter);
  }
}
