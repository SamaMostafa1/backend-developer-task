import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { MembersService } from './members.service';
import { MembersRepository } from './members.repository';
import { AppLogger } from 'src/common/logger/logger';

describe('MembersService', () => {
  let service: MembersService;
  let repository: jest.Mocked<
    Pick<MembersRepository, 'create' | 'findAll' | 'findOne' | 'update' | 'delete'>
  >;
  let logger: jest.Mocked<AppLogger>;
  let cacheManager: { get: jest.Mock; set: jest.Mock; del: jest.Mock; clear: jest.Mock };

  const member = {
    id: '33c6ebd6-6038-4e2f-9096-6788305ef07c',
    firstName: 'John',
    lastName: 'Doe',
    gender: 'male',
    dateOfBirth: '1990-01-01',
    phone: '+201012345678',
  };

  const centralMember = {
    id: '31c6ebd6-6038-4e2f-9096-6788305ef07c',
    firstName: 'Jane',
    lastName: 'Doe',
    gender: 'female',
    dateOfBirth: '1990-01-01',
    phone: '+201113455678',
  };

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
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

    cacheManager = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
      clear: jest.fn(),
    };

    service = new MembersService(
      repository as unknown as MembersRepository,
      logger,
      cacheManager as any,
    );
  });

 
  describe('create', () => {
    it('creates a member without centralMemberId successfully', async () => {
      const memberWithoutCentral = { ...member, centralMemberId: undefined };
      repository.create.mockResolvedValue(memberWithoutCentral as any);
      cacheManager.clear.mockResolvedValue(undefined);

      await expect(service.create(memberWithoutCentral)).resolves.toEqual(memberWithoutCentral);
      expect(repository.create).toHaveBeenCalled();
      expect(cacheManager.clear).toHaveBeenCalled();
    });

    it('creates a member with valid centralMemberId successfully', async () => {
      const memberWithCentral = { ...member, centralMemberId: centralMember.id };
      repository.findOne.mockResolvedValue(centralMember as any);
      repository.create.mockResolvedValue(memberWithCentral as any);
      cacheManager.clear.mockResolvedValue(undefined);

      await expect(service.create(memberWithCentral)).resolves.toEqual(memberWithCentral);
      expect(repository.findOne).toHaveBeenCalledWith(centralMember.id);
      expect(cacheManager.clear).toHaveBeenCalled();
    });

    it('throws NotFoundException when centralMemberId does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(
        service.create({ ...member, centralMemberId: centralMember.id }),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(repository.create).not.toHaveBeenCalled();
    });

    it('throws BadRequestException when centralMember is a family member', async () => {
      repository.findOne.mockResolvedValue({
        ...centralMember,
        centralMemberId: 'some-other-id',
      } as any);

      await expect(
        service.create({ ...member, centralMemberId: centralMember.id }),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(repository.create).not.toHaveBeenCalled();
    });

    it('throws error when repository fails to create member', async () => {
      repository.create.mockRejectedValue(new Error('DB error'));

      await expect(
        service.create({ ...member, centralMemberId: undefined }),
      ).rejects.toThrow('DB error');
    });
  });

  describe('findAll', () => {
    const paginationQuery = { page: 1, limit: 20 };
    const paginatedResult = {
      data: [member],
      total: 1,
      page: 1,
      limit: 20,
      totalPages: 1,
    };

    it('returns cached members on cache hit', async () => {
      cacheManager.get.mockResolvedValue(paginatedResult);

      await expect(service.findAll(paginationQuery)).resolves.toEqual(paginatedResult);
      expect(repository.findAll).not.toHaveBeenCalled();
    });

    it('queries DB and caches result on cache miss', async () => {
      cacheManager.get.mockResolvedValue(null);
      repository.findAll.mockResolvedValue({ rows: [member], count: 1 } as any);
      cacheManager.set.mockResolvedValue(undefined);

      await expect(service.findAll(paginationQuery)).resolves.toEqual(paginatedResult);
      expect(repository.findAll).toHaveBeenCalledWith(20, 0);
      expect(cacheManager.set).toHaveBeenCalledWith(
        'members:page=1:limit=20',
        paginatedResult,
        60000,
      );
    });

    it('returns empty data when no members exist', async () => {
      cacheManager.get.mockResolvedValue(null);
      repository.findAll.mockResolvedValue({ rows: [], count: 0 } as any);

      await expect(service.findAll(paginationQuery)).resolves.toEqual({
        data: [],
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
      });
    });

    it('throws error when repository fails to find members', async () => {
      cacheManager.get.mockResolvedValue(null);
      repository.findAll.mockRejectedValue(new Error('DB error'));

      await expect(service.findAll(paginationQuery)).rejects.toThrow('DB error');
    });
  });

  
  describe('findOne', () => {
    it('returns a member by ID successfully', async () => {
      repository.findOne.mockResolvedValue(member as any);

      await expect(service.findOne(member.id)).resolves.toEqual(member);
      expect(repository.findOne).toHaveBeenCalledWith(member.id);
    });

    it('throws NotFoundException when member is not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne(member.id)).rejects.toBeInstanceOf(NotFoundException);
    });

    it('throws error when repository fails to find member', async () => {
      repository.findOne.mockRejectedValue(new Error('DB error'));

      await expect(service.findOne(member.id)).rejects.toThrow('DB error');
    });
  });

  
  describe('update', () => {
    it('updates a member successfully', async () => {
      const updatedMember = { ...member, firstName: 'Updated' };
      repository.update.mockResolvedValue(updatedMember as any);
      cacheManager.clear.mockResolvedValue(undefined);

      await expect(
        service.update(member.id, { firstName: 'Updated' }),
      ).resolves.toEqual(updatedMember);
      expect(cacheManager.clear).toHaveBeenCalled();
    });

    it('throws NotFoundException when member to update is not found', async () => {
      repository.update.mockResolvedValue(null as any);

      await expect(
        service.update(member.id, { firstName: 'Updated' }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('throws error when repository fails to update member', async () => {
      repository.update.mockRejectedValue(new Error('DB error'));

      await expect(
        service.update(member.id, { firstName: 'Updated' }),
      ).rejects.toThrow('DB error');
    });
  });


  describe('delete', () => {
    it('deletes a member successfully', async () => {
      repository.delete.mockResolvedValue(1 as any);
      cacheManager.clear.mockResolvedValue(undefined);

      await expect(service.delete(member.id)).resolves.toBeUndefined();
      expect(cacheManager.clear).toHaveBeenCalled();
    });

    it('throws NotFoundException when member to delete is not found', async () => {
      repository.delete.mockResolvedValue(0 as any);

      await expect(service.delete(member.id)).rejects.toBeInstanceOf(NotFoundException);
    });

    it('throws error when repository fails to delete member', async () => {
      repository.delete.mockRejectedValue(new Error('DB error'));

      await expect(service.delete(member.id)).rejects.toThrow('DB error');
    });
  });
});