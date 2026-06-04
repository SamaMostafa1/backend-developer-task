import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
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
  async findWithFilter(filter: Partial<Product>): Promise<Product[]> {
    return this.productModel.findAll({ where: filter });
  }
  async findWithSearch(options: {
    search?: string;
    searchField?: string;
    page?: number;
    limit?: number;
    where?: Partial<Product>;
  }): Promise<{ rows: Product[]; count: number }> {
    const { search, searchField, page = 1, limit = 20, where = {} } = options;

    const filter = {
      ...where,
      ...(search && searchField
        ? {
            [searchField]: {
              [Op.iLike]: `%${search}%`,
            },
          }
        : {}),
    };

    return this.productModel.findAndCountAll({
      where: filter,
      limit,
      offset: (page - 1) * limit,
    });
  }
  async update(id: string, product: Partial<Product>): Promise<Product> {
    const result = await this.productModel.update(product, {
      where: { id },
      returning: true,
    });

    return result[1][0];
  }
  async delete(id: string): Promise<void> {
    await this.productModel.destroy({ where: { id } });
  }
}
