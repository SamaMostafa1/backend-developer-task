import { Injectable, NotFoundException } from '@nestjs/common';
import { AppLogger } from 'src/common/logger/logger';
import { CreateShopDTO } from 'src/modules/shops/dto/create-shop.dto';
import { ShopWithProductsDTO } from 'src/modules/shops/dto/shop-with-products.dto';
import { ShopDTO } from 'src/modules/shops/dto/shop.dto';
import { UpdateShopDTO } from 'src/modules/shops/dto/update-shop.dto';
import { ShopsRepository } from 'src/modules/shops/shops.repository';

 
@Injectable()
export class ShopsService {
  constructor(
    private readonly repository: ShopsRepository,
    private readonly logger: AppLogger,
  ) {}

  async create(shop: CreateShopDTO): Promise<ShopDTO> {
    try {
      const createdShop = await this.repository.create(shop);
      this.logger.debug(
        `Created shop with ID: ${createdShop.id}`,
        'ShopsService',
      );
      return createdShop;
    } catch (error: any) {
      this.logger.error('Error creating shop', error, 'ShopsService');
      throw error;
    }
  }

  async findAll(): Promise<ShopDTO[]> {
    try {
      const shops = await this.repository.findAll();
      this.logger.debug(`Found ${shops.length} shops`, 'ShopsService');
      return shops;
    } catch (error: any) {
      this.logger.error('Error finding shops', error, 'ShopsService');
      throw error;
    }
  }

  /**
   * This method finds all shops with their products
   * @returns All shops with their products
   */
  async findAllWithProducts(): Promise<ShopWithProductsDTO[]> {
    try {
      const shops = await this.repository.findAllWithProducts();
      this.logger.debug(
        `Found ${shops.length} shops with products`,
        'ShopsService',
      );
      return shops;
    } catch (error: any) {
      this.logger.error(
        'Error finding shops with products',
        error,
        'ShopsService',
      );
      throw error;
    }
  }

  async findOne(id: string): Promise<ShopDTO> {
    try {
      const shop = await this.repository.findOne(id);
      
      if (!shop) {
        this.logger.warn(`Shop with ID: ${id} not found`, 'ShopsService');
        throw new NotFoundException('Shop not found');
      }
      this.logger.debug(`Found shop with ID: ${id}`, 'ShopsService');
      return shop;
    } catch (error: any) {
      this.logger.error('Error finding shop', error, 'ShopsService');
      throw error;
    }
  }

  async update(id: string, shop: UpdateShopDTO): Promise<ShopDTO> {
    try {
      const [affectedRows, updatedShop] = await this.repository.update(
        id,
        shop,
      );
      if (affectedRows === 0) {
        this.logger.warn(
          `Shop with ID: ${id} not found for update`,
          'ShopsService',
        );
        throw new NotFoundException('Shop not found');
      }
      this.logger.debug(`Updated shop with ID: ${id}`, 'ShopsService');
      return updatedShop[0];
    } catch (error: any) {
      this.logger.error('Error updating shop', error, 'ShopsService');
      throw error;
    }
  }

  async delete(id: string) {
    try {
      const deletedRow= await this.repository.delete(id);
      if (deletedRow === 0) {
        throw new NotFoundException(`Shop with ID ${id} not found`);
      }
      this.logger.debug(`Deleted shop with ID: ${id}`, 'ShopsService');
    } catch (error: any) {
      this.logger.error('Error deleting shop', error, 'ShopsService');
      throw error;
    }
  }
}
