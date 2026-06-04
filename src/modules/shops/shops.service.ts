import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/modules/products/products.service';
import { CreateShopDTO } from 'src/modules/shops/dto/create-shop.dto';
import { ShopWithProductsDTO } from 'src/modules/shops/dto/shop-with-products.dto';
import { ShopDTO } from 'src/modules/shops/dto/shop.dto';
import { UpdateShopDTO } from 'src/modules/shops/dto/update-shop.dto';
import { ShopsRepository } from 'src/modules/shops/shops.repository';

@Injectable()
export class ShopsService {
  constructor(
    private readonly repository: ShopsRepository,
    // private readonly productsService: ProductsService,
  ) {}

  async create(shop: CreateShopDTO): Promise<ShopDTO> {
    return this.repository.create(shop);
  }

  async findAll(): Promise<ShopDTO[]> {
    return this.repository.findAll();
  }

  /**
   * This method finds all shops with their products
   * @returns All shops with their products
   */
  async findAllWithProducts(): Promise<ShopWithProductsDTO[]> {
    const everything = await this.repository.findAll();

    const arr = [];

    // for (let i = 0; i < everything.length; i++) {
    //   const shop = everything[i];
    //   const products = await this.productsService.findWithFilter({
    //     shopId: shop.id,
    //   });
    //   arr.push({
    //     ...shop,
    //     products,
    //   });
    // }

    return arr;
  }

  async findOne(id: string): Promise<ShopDTO> {
    return this.repository.findOne(id);
  }

  async update(id: string, shop: UpdateShopDTO): Promise<ShopDTO> {
    return this.repository.update(id, shop);
  }

  async delete(id: string) {
    return this.repository.delete(id);
  }
}
