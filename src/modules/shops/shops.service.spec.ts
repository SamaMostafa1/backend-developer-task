import { AppLogger } from 'src/common/logger/logger';
import { ShopsRepository } from './shops.repository';
import { ShopsService } from './shops.service';
import { NotFoundException } from '@nestjs/common';

describe('ShopsService', () => {
  let service: ShopsService;
  let repository: jest.Mocked<
    Pick<
      ShopsRepository,
      | 'create'
      | 'findAll'
      | 'findAllWithProducts'
      | 'findOne'
      | 'update'
      | 'delete'
    >
  >;
  let logger: jest.Mocked<AppLogger>;
  const shop = {
    id: '31c6ebd6-6038-4e2f-9096-6788305ef07c',
    name: 'Test Shop',
    openingHour: new Date('2024-01-01T09:00:00.000Z'),
    closingHour: new Date('2024-01-01T18:00:00.000Z'),
    availability: 'open',
  };
  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findAllWithProducts: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    logger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    } as unknown as jest.Mocked<AppLogger>;
    service = new ShopsService(
      repository as unknown as ShopsRepository,
      logger,
    );
  });
  describe('create', () => {
    it('creates a shop successfully', async () => {
      repository.create.mockResolvedValue(shop as any);
      await expect(service.create(shop)).resolves.toEqual(shop);
      expect(repository.create).toHaveBeenCalledWith(shop);
    });
    it('throws error when repository fails to create shop', async () => {
      repository.create.mockRejectedValue(new Error('DB error'));
      await expect(service.create(shop)).rejects.toThrow('DB error');
    });
  });
  describe('findAll', () => {
    it('finds all shops successfully', async () => {
      repository.findAll.mockResolvedValue([shop] as any);
      await expect(service.findAll()).resolves.toEqual([shop]);
      expect(repository.findAll).toHaveBeenCalled();
    });

    it('throws error when repository fails to find all shops', async () => {
      repository.findAll.mockRejectedValue(new Error('DB error'));
      await expect(service.findAll()).rejects.toThrow('DB error');
    });
  });
  describe('findAllWithProduct', () => {
    it('finds all shops with products successfully', async () => {
      const shopWithProducts = {
        ...shop,
        products: [
          {
            id: '4bb0b8e2-a6a8-42a0-8e44-bc8b9f9f44e1',
            shopId: '31c6ebd6-6038-4e2f-9096-6788305ef07c',
            name: 'Apple Juice',
            description: 'Fresh juice',
            price: 100,
            stockCount: 10,
          },
        ],
      };
      repository.findAllWithProducts.mockResolvedValue([
        shopWithProducts,
      ] as any);
      await expect(service.findAllWithProducts()).resolves.toEqual([
        shopWithProducts,
      ]);
      expect(repository.findAllWithProducts).toHaveBeenCalled();
    });
    it('throws error when repository fails to find all shops with products', async () => {
      repository.findAllWithProducts.mockRejectedValue(new Error('DB error'));
      await expect(service.findAllWithProducts()).rejects.toThrow('DB error');
    });
  });
  describe('findById', () => {
    it('finds a shop by ID successfully', async () => {
      repository.findOne.mockResolvedValue(shop as any);
      await expect(service.findOne(shop.id)).resolves.toEqual(shop);
      expect(repository.findOne).toHaveBeenCalledWith(shop.id);
    });
    it('throws error when repository fails to find shop', async () => {
      repository.findOne.mockRejectedValue(new Error('DB error'));
      await expect(service.findOne(shop.id)).rejects.toThrow('DB error');
    });

    it('throws NotFoundException when shop is not found', async () => {
      repository.findOne.mockResolvedValue(null as any);
      await expect(service.findOne(shop.id)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(repository.findOne).toHaveBeenCalledWith(shop.id);
    });
  });
  describe('update', () => {
    it('updates a shop successfully', async () => {
      const updatedShop = { ...shop, name: 'Updated Shop' };
      repository.update.mockResolvedValue([1, [updatedShop]] as any);
      await expect(
        service.update(shop.id, { name: 'Updated Shop' }),
      ).resolves.toEqual(updatedShop);
      expect(repository.update).toHaveBeenCalledWith(shop.id, {
        name: 'Updated Shop',
      });
    });
    it('throws error when repository fails to update shop', async () => {
      repository.update.mockRejectedValue(new Error('DB error'));
      await expect(
        service.update(shop.id, { name: 'Updated Shop' }),
      ).rejects.toThrow('DB error');
    });

    it('throws NotFoundException when updating a non-existent shop', async () => {
      repository.update.mockResolvedValue([0, []] as any);
      await expect(
        service.update(shop.id, { name: 'Updated Shop' }),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(repository.update).toHaveBeenCalledWith(shop.id, {
        name: 'Updated Shop',
      });
    });
  });
  describe('delete', () => {
    it('deletes a shop successfully', async () => {
      repository.delete.mockResolvedValue(undefined as any);
      await expect(service.delete(shop.id)).resolves.toBeUndefined();
      expect(repository.delete).toHaveBeenCalledWith(shop.id);
    });
    it('throws error when repository fails to delete shop', async () => {
      repository.delete.mockRejectedValue(new Error('DB error'));
      await expect(service.delete(shop.id)).rejects.toThrow('DB error');
    });
  });
});
