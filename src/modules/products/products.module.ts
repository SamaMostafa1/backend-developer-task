import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from 'src/modules/products/products.model';
import { ProductsController } from 'src/modules/products/products.controller';
import { ProductsService } from 'src/modules/products/products.service';
import { ProductsRepository } from 'src/modules/products/products.repository';
import { ShopsModule } from '../shops/shops.module';
import { LoggerModule } from 'src/common/logger/logger.module';

@Module({
  imports: [SequelizeModule.forFeature([Product]), LoggerModule,ShopsModule],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository],
  exports: [ProductsService, ProductsRepository],
})
export class ProductsModule {}
