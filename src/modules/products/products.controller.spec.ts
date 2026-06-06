import { Test, TestingModule } from '@nestjs/testing';
import { AppLogger } from 'src/common/logger/logger';
import { ProductsController } from 'src/modules/products/products.controller';
import { ProductsService } from 'src/modules/products/products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: jest.Mocked<
    Pick<ProductsService, 'create' | 'findProducts' | 'findOne' | 'update' | 'delete'>
  >;

  const product = {
    id: '4bb0b8e2-a6a8-42a0-8e44-bc8b9f9f44e1',
    shopId: '31c6ebd6-6038-4e2f-9096-6788305ef07c',
    name: 'Apple Juice',
    description: 'Fresh juice',
    price: 100,
    stockCount: 10,
  };

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findProducts: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        { provide: ProductsService, useValue: service },
        {
          provide: AppLogger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('creates a product', async () => {
    service.create.mockResolvedValue(product as any);

    await expect(controller.create(product)).resolves.toEqual(product);
    expect(service.create).toHaveBeenCalledWith(product);
  });

  it('lists products using query params', async () => {
  const query = { search: 'app', page: 1, limit: 20 };

  service.findProducts.mockResolvedValue({
    data: [product],
    total: 1,
    page: 1,
    limit: 20,
    totalPages: 1,
  } as any);

  await expect(controller.findProducts(query)).resolves.toEqual({
    data: [product],
    total: 1,
    page: 1,
    limit: 20,
    totalPages: 1,
  });

  expect(service.findProducts).toHaveBeenCalledWith(query);
});
  it('fetches a product by id', async () => {
    service.findOne.mockResolvedValue(product as any);

    await expect(controller.findOne(product.id)).resolves.toEqual(product);
    expect(service.findOne).toHaveBeenCalledWith(product.id);
  });

  it('updates a product', async () => {
    const update = { name: 'Updated Juice' };
    const updatedProduct = { ...product, ...update };
    service.update.mockResolvedValue(updatedProduct as any);

    await expect(controller.update(product.id, update)).resolves.toEqual(
      updatedProduct,
    );
    expect(service.update).toHaveBeenCalledWith(product.id, update);
  });

  it('deletes a product', async () => {
    service.delete.mockResolvedValue(undefined);

    await expect(controller.delete(product.id)).resolves.toBeUndefined();
    expect(service.delete).toHaveBeenCalledWith(product.id);
  });
});
