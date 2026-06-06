import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions, Op, Sequelize, WhereOptions } from 'sequelize';
import { Product } from 'src/modules/products/products.model';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectModel(Product) private readonly productModel: typeof Product,
  ) {}
  async create(product: Partial<Product>): Promise<Product | null> {
    return this.productModel.create(product);
  }

  async findOne(id: string): Promise<Product | null> {
    return this.productModel.findByPk(id);
  }
  async findWithFilter(
    where: WhereOptions<Product>,
    limit?: number,
    offset?: number,
  ): Promise<{rows: Product[]; count: number }> {
    const queryOptions: FindOptions<Product> = { where };
    if (limit) queryOptions.limit = limit;
    if (offset) queryOptions.offset = offset;
    return this.productModel.findAndCountAll(queryOptions);
  }

  async update(id: string, product: Partial<Product>): Promise<[number, Product[]]> {
   return this.productModel.update(product, {
    where: { id },
    returning: true,
  });
}

  async changeStock(where: WhereOptions<Product>, amount: number) {
    return this.productModel.update(
      {
        stockCount: Sequelize.literal(` stockCount + (${amount})`),
      },
      { where },
    );
  }
  async delete(id: string): Promise<number> {
    return this.productModel.destroy({ where: { id } });
  }
}
