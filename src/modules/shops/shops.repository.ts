import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Shop } from 'src/modules/shops/shops.model';
import { Product } from '../products/products.model';
import { WhereOptions } from 'sequelize';
import { ShopWithProductsDTO } from './dto/shop-with-products.dto';

@Injectable()
export class ShopsRepository {
  constructor(@InjectModel(Shop) private readonly shopModel: typeof Shop) {}

  async create(shop: Partial<Shop>): Promise<Shop> {
    return this.shopModel.create(shop);
  }

  async findAll(limit?: number, offset?: number): Promise<Shop[]> {
    const queryOptions: { limit?: number; offset?: number } = {};
    if (limit) queryOptions.limit = limit;
    if (offset) queryOptions.offset = offset;

    return this.shopModel.findAll(queryOptions);
  }

  async findAllWithProducts(limit?: number, offset?: number): Promise<ShopWithProductsDTO[]> {
    const queryOptions: { limit?: number; offset?: number } = {};
    if (limit) queryOptions.limit = limit;
    if (offset) queryOptions.offset = offset;

    return this.shopModel.findAll({
      ...queryOptions,
      include: [
        {
          model: Product,
          separate: true,
        },
      ],
    });
  }

  async findOne(id: string): Promise<Shop> {
    return this.shopModel.findByPk(id);
  }

  async update(id: string, shop: Partial<Shop>): Promise<[affectedRows: number,  Shop[]]> {
    const result = await this.shopModel.update(shop, {
      where: { id },
      returning: true,
    });

    return result;
  }

  async delete(id: string): Promise<void> {
    await this.shopModel.destroy({ where: { id } });
  }
}
