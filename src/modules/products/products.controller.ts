import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

import { CreateProductDTO } from './dto/create-product.dto';
import { ProductDTO } from './dto/product.dto';
import { AppLogger } from 'src/common/logger/logger';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService, private readonly logger: AppLogger) {}
    
      @Post()
      async create(@Body() createProductDto: CreateProductDTO): Promise<ProductDTO> {
        this.logger.log('Creating a new product', JSON.stringify(createProductDto));
        return this.productsService.create(createProductDto);
      }
      @Get()
      async findWithFilter(@Query() filter: Partial<ProductDTO>): Promise<ProductDTO[]> {
        return this.productsService.findWithFilter(filter);
      }
    //   @Get('search')
    //   async search(
    //     @Query('search') search: string,
    //     @Query('searchField') searchField: string,
    //     @Query('page') page: number,
    //     @Query('limit') limit: number,
    //   ): Promise<{ rows: ProductDTO[]; count: number }> {
    //     return this.productsService.findWithSearch({
    //       search,
    //       searchField,
    //       page,
    //       limit,
    //     });
    //   }

}
