import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Shop } from 'src/modules/shops/shops.model';
import { ShopsController } from 'src/modules/shops/shops.controller';
import { ShopsService } from 'src/modules/shops/shops.service';
import { ShopsRepository } from 'src/modules/shops/shops.repository';
import { LoggerModule } from 'src/common/logger/logger.module';

@Module({
  
  imports: [SequelizeModule.forFeature([Shop]),LoggerModule],
  controllers: [ShopsController],
  providers: [ShopsService, ShopsRepository],
  exports: [ShopsService, ShopsRepository],
})
export class ShopsModule {}
