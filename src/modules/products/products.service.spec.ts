import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Op } from 'sequelize';
import { AppLogger } from 'src/common/logger/logger';
import { ProductsRepository } from 'src/modules/products/products.repository';
import { ProductsService } from 'src/modules/products/products.service';
import { ShopsService } from 'src/modules/shops/shops.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: jest.Mocked<
    Pick<
      ProductsRepository,
      | 'create'
      | 'findOne'
      | 'findWithFilter'
      | 'update'
      | 'changeStock'
      | 'delete'
    >
  >;
  let shopsService: jest.Mocked<Pick<ShopsService, 'findOne'>>;
  let logger: jest.Mocked<AppLogger>;

  const product = {
    id: '4bb0b8e2-a6a8-42a0-8e44-bc8b9f9f44e1',
    shopId: '31c6ebd6-6038-4e2f-9096-6788305ef07c',
    name: 'Apple Juice',
    description: 'Fresh juice',
    price: 100,
    stockCount: 10,
  };

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findOne: jest.fn(),
      findWithFilter: jest.fn(),
      update: jest.fn(),
      changeStock: jest.fn(),
      delete: jest.fn(),
    };

    shopsService = {
      findOne: jest.fn(),
    };

    logger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    } as unknown as jest.Mocked<AppLogger>;

    service = new ProductsService(
      repository as unknown as ProductsRepository,
      shopsService as unknown as ShopsService,
      logger,
    );
  });

  it('creates a product when the shop exists', async () => {
    shopsService.findOne.mockResolvedValue({ id: product.shopId } as any);
    repository.create.mockResolvedValue(product as any);

    await expect(service.create(product)).resolves.toEqual(product);

    expect(shopsService.findOne).toHaveBeenCalledWith(product.shopId);
    expect(repository.create).toHaveBeenCalledWith(product);
  });

  it('throws when creating a product for a missing shop', async () => {
    shopsService.findOne.mockResolvedValue(null as any);

    await expect(service.create(product)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('lists products with case-insensitive search and pagination', async () => {
    repository.findWithFilter.mockResolvedValue([product] as any);

    await expect(
      service.findProducts({ search: 'app', page: 2, limit: 5 }),
    ).resolves.toEqual([product]);

    expect(repository.findWithFilter).toHaveBeenCalledWith(
      { name: { [Op.iLike]: '%app%' } },
      5,
      5,
    );
  });

  it('returns a product by id', async () => {
    repository.findOne.mockResolvedValue(product as any);

    await expect(service.findOne(product.id)).resolves.toEqual(product);
  });

  it('throws when product is not found by id', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(service.findOne(product.id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('updates a product and validates a new shop id', async () => {
    const newShopId = '07c071e7-9d89-4cf5-a9df-e99484e6fda7';
    const updatedProduct = { ...product, shopId: newShopId };
    shopsService.findOne.mockResolvedValue({ id: newShopId } as any);
    repository.update.mockResolvedValue([1, [updatedProduct as any]]);

    await expect(
      service.update(product.id, { shopId: newShopId }),
    ).resolves.toEqual(updatedProduct);

    expect(shopsService.findOne).toHaveBeenCalledWith(newShopId);
    expect(repository.update).toHaveBeenCalledWith(product.id, {
      shopId: newShopId,
    });
  });
  it ('throws when updating a product with a missing shop id', async () => {
    const newShopId = '07c071e7-9d89-4cf5-a9df-e99484e6fda7';
    shopsService.findOne.mockResolvedValue(null as any);

    await expect(
      service.update(product.id, { shopId: newShopId }),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(shopsService.findOne).toHaveBeenCalledWith(newShopId);
    expect(repository.update).not.toHaveBeenCalled();
    
  });

  it('throws when update target product does not exist', async () => {
    repository.update.mockResolvedValue([0, []]);

    await expect(
      service.update(product.id, { name: 'New name' }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(repository.update).toHaveBeenCalledWith(product.id, {
  name: 'New name',
});
  });

  it('deducts stock with ', async () => {
    repository.changeStock.mockResolvedValue([1] as any);

    await expect(service.deductStock(product.id, 3)).resolves.toBeUndefined();

    expect(repository.changeStock).toHaveBeenCalledWith(
      {
        id: product.id,
        stockCount: {
          [Op.gte]: expect.any(Number),
        },
      },
      -3,
    );
  });

  it('throws when stock deduction cannot be applied', async () => {
    repository.changeStock.mockResolvedValue([0] as any);

    await expect(service.deductStock(product.id, 3)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('deletes an existing product', async () => {
    repository.delete.mockResolvedValue(1);
    await expect(service.delete(product.id)).resolves.toBeUndefined();
     expect(repository.delete).toHaveBeenCalledWith(product.id);
  });

  it('throws when deleting a missing product', async () => {
    repository.delete.mockResolvedValue(0);

    await expect(service.delete(product.id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
      expect(repository.delete).toHaveBeenCalledWith(product.id);
  });
});
