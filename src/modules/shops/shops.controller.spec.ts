import { AppLogger } from 'src/common/logger/logger';
import { ShopsController } from './shops.controller';
import { ShopsService } from './shops.service';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

describe('ShopsController', () => {
  let controller: ShopsController;
  let service: jest.Mocked<
    Pick<
      ShopsService,
      | 'create'
      | 'findAll'
      | 'findAllWithProducts'
      | 'findOne'
      | 'update'
      | 'delete'
    >
  >;

  const shop = {
    id: '31c6ebd6-6038-4e2f-9096-6788305ef07c',
    name: 'Test Shop',
    openingHour: new Date('2024-01-01T09:00:00.000Z'),
    closingHour: new Date('2024-01-01T18:00:00.000Z'),
    availability: 'open',
  };

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findAllWithProducts: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShopsController],
      providers: [
        { provide: ShopsService, useValue: service },

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

    controller = module.get<ShopsController>(ShopsController);
  });
  it('should create a shop', async () => {
    service.create.mockResolvedValue(shop as any);
    await expect(controller.create(shop)).resolves.toEqual(shop);
    expect(service.create).toHaveBeenCalledWith(shop);
  });
  it('should find all shops', async () => {
    service.findAll.mockResolvedValue([shop] as any);
    await expect(controller.findAll()).resolves.toEqual([shop]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should find all shops with products', async () => {
    const shopWithProducts = {
      ...shop,
      products: [
        {
          id: '4bb0b8e2-a6a8-42a0-8e44-bc8b9f9f44e1',
          name: 'Apple Juice',
          description: 'Fresh juice',
          price: 100,
          stockCount: 10,
        },
      ],
    };
    service.findAllWithProducts.mockResolvedValue([shopWithProducts] as any);
    await expect(controller.findAllWithProducts()).resolves.toEqual([
      shopWithProducts,
    ]);
    expect(service.findAllWithProducts).toHaveBeenCalled();
  });
  it('should find a shop by id', async () => {
    service.findOne.mockResolvedValue(shop as any);
    await expect(controller.findOne(shop.id)).resolves.toEqual(shop);
    expect(service.findOne).toHaveBeenCalledWith(shop.id);
  });
  it('should throw NotFoundException when shop is not found', async () => {
    service.findOne.mockRejectedValue(new NotFoundException('Shop not found'));
    await expect(controller.findOne(shop.id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
  it('should update a shop', async () => {
    const updatedShop = { ...shop, name: 'Updated Shop' };
    service.update.mockResolvedValue(updatedShop as any);
    await expect(
      controller.update(shop.id, { name: 'Updated Shop' }),
    ).resolves.toEqual(updatedShop);
    expect(service.update).toHaveBeenCalledWith(shop.id, {
      name: 'Updated Shop',
    });
  });
  it('should throw NotFoundException when updating non-existent shop', async () => {
    service.update.mockRejectedValue(new NotFoundException('Shop not found'));
    await expect(
      controller.update(shop.id, { name: 'Updated Shop' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
  it('should delete a shop', async () => {
    service.delete.mockResolvedValue(undefined);
    await expect(controller.delete(shop.id)).resolves.toBeUndefined();
    expect(service.delete).toHaveBeenCalledWith(shop.id);
  });
});
