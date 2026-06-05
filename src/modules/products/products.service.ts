import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductsRepository } from 'src/modules/products/products.repository';
import { ShopsService } from 'src/modules/shops/shops.service';
import { ProductDTO } from 'src/modules/products/dto/product.dto';
import { AppLogger } from 'src/common/logger/logger';
import { CreateProductDTO } from './dto/create-product.dto';
import { Op, WhereOptions } from 'sequelize';
import { updateProductDTO } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly repository: ProductsRepository,
    private readonly shopService: ShopsService,
    private readonly logger: AppLogger,
  ) {}
  private async validateShop(shopId?: string) {
  if (!shopId) return;

  const shop = await this.shopService.findOne(shopId);

  if (!shop) {
    throw new NotFoundException('Shop not found');
  }
}

  async findWithFilter(filter: Partial<ProductDTO>): Promise<ProductDTO[]> {
    const where: WhereOptions<ProductDTO> = {
      ...filter,
    };
    try {
      const products = await this.repository.findWithFilter(where);
      this.logger.debug(`Found ${products.length} products`, 'ProductsService');
      return products;
    } catch (error: any) {
      this.logger.error('Error finding products', error, 'ProductsService');
      throw error;
    }
  }
  /*
   * This method finds products with pagination and search. It accepts a query object with the following properties:
   * - search: a string to search for in the product name
   * - page: a number to specify the page of results to return (default is 1)
   * - limit: a number to specify the number of results per page (default is 20)
   */

  async findProducts(query: ProductQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const offset = (page - 1) * limit;
    const where: WhereOptions<ProductDTO> = {};

    if (query.search) {
      where.name = {
        [Op.iLike]: `%${query.search}%`,
      };
    }
    try {
      const products = await this.repository.findWithFilter(
        where,
        limit,
        offset,
      );
      this.logger.debug(`Found ${products.length} products`, 'ProductsService');
      return products;
    } catch (error: any) {
      this.logger.error('Error finding products', error, 'ProductsService');
      throw error;
    }
  }

  /**
   * This method finds a single product by its ID.
   * @param id The ID of the product to find
   * @return The found product
   * @throws NotFoundException if the product is not found
   */
  async findOne(productId: string): Promise<ProductDTO> {
    try {
      const product = await this.repository.findOne(productId);
      if (!product) {
        this.logger.warn(
          `Product with ID ${productId} not found`,
          'ProductsService',
        );
        throw new NotFoundException('Product not found');
      }
      this.logger.debug(
        `Found product with ID: ${productId}`,
        'ProductsService',
      );
      return product;
    } catch (error: any) {
      this.logger.error('Error finding product', error, 'ProductsService');
      throw error;
    }
  }

  /**
   * This method creates a new product. It first checks if the shop exists, and if it does, it creates the product. If the shop does not exist, it throws a NotFoundException.
   * @param product The product to create
   * @return The created product
   * @throws NotFoundException if the shop does not exist
   */
  async create(product: CreateProductDTO): Promise<ProductDTO> {
    await this.validateShop(product.shopId);
    try {
      const createdProduct = await this.repository.create(product);
      this.logger.debug(
        `Product created with ID: ${createdProduct.id}`,
        'ProductsService',
      );
      return createdProduct;
    } catch (error: any) {
      this.logger.error('Error creating product', error, 'ProductsService');
      throw error;
    }
  }
  /**
   * This method updates an existing product. It first checks if the product exists, and if it does, it updates the product. If the product does not exist, it throws a NotFoundException.
   * @param id The ID of the product to update
   * @param product The updated product data
   * @return The updated product
   * @throws NotFoundException if the product does not exist
   */
  async update(
    productId: string,
    product: Partial<updateProductDTO>,
  ): Promise<ProductDTO> {
    if (product.shopId) {
      await this.validateShop(product.shopId);
    }
    try {
      const [updatedRows, updatedProduct] = await this.repository.update(
        productId,
        product,
      );
      if (updatedRows === 0) {
        throw new NotFoundException('Product not found');
      }
      this.logger.debug(
        `Product updated with ID: ${productId}`,
        'ProductsService',
      );
      return updatedProduct[0];
    } catch (error: any) {
      this.logger.error('Error updating product', error, 'ProductsService');
      throw error;
    }
  }
  /**
   * This method deducts stock from a product. It first checks if the product exists, and if it does, it deducts the stock. If the product does not exist, it throws a NotFoundException.
   * @param productId The ID of the product to deduct stock from
   *  @param amount The amount of stock to deduct
   * @return void
   * @throws NotFoundException if the product does not exist
   */
  async deductStock(productId: string, amount: number) {
    try {
      const [affectedRows] = await this.repository.changeStock(
        {
          id: productId,
          stockCount: {
            [Op.gte]: amount + 1,
          },
        },
        -amount,
      );
      if (affectedRows === 0) {
        throw new BadRequestException(
          'Product not found or insufficient stock',
        );
      }
      this.logger.debug(
        `Stock deducted for product with ID: ${productId} by amount: ${amount}`,
        'ProductsService',
      );
    } catch (error: any) {
      this.logger.error('Error deducting stock', error, 'ProductsService');
      throw error;
    }
  }
  /**
   * This method deletes a product. It first checks if the product exists, and if it does, it deletes the product. If the product does not exist, it throws a NotFoundException.
   * @param id The ID of the product to delete
   * @return void
   * @throws NotFoundException if the product does not exist
   */
  async delete(productId: string): Promise<void> {
    try {
      const deletedRow = await this.repository.delete(productId);
      if (deletedRow === 0) {
        throw new NotFoundException('Product not found');
      }
      this.logger.debug(
        `Product deleted with ID: ${productId}`,
        'ProductsService',
      );
    } catch (error: any) {
      this.logger.error('Error deleting product', error, 'ProductsService');
      throw error;
    }
  }
}
