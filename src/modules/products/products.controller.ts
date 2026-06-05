import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

import { CreateProductDTO } from './dto/create-product.dto';
import { ProductDTO } from './dto/product.dto';
import { AppLogger } from 'src/common/logger/logger';
import { ProductQueryDto } from './dto/product-query.dto';
import { updateProductDTO } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService, private readonly logger: AppLogger) {}
    
      @Post()
      async create(@Body() createProductDto: CreateProductDTO): Promise<ProductDTO> {
        this.logger.log('Creating a new product', JSON.stringify(createProductDto));
        return this.productsService.create(createProductDto);
      }
      @Get()
      async findProducts(@Query() query: ProductQueryDto): Promise<ProductDTO[]> {
        return this.productsService.findProducts(query);
      }
      @Get(':id')
      async findOne(@Param('id',ParseUUIDPipe) id: string): Promise<ProductDTO> {
        return this.productsService.findOne(id);
      }
     @Patch(':id')
      async update(@Param('id',ParseUUIDPipe) id: string, @Body() updateProductDto: updateProductDTO): Promise<ProductDTO> {
        return this.productsService.update(id, updateProductDto);
      }
      @Delete(':id')
      async delete(@Param('id',ParseUUIDPipe) id: string): Promise<void> {
        return this.productsService.delete(id);
      }

}
