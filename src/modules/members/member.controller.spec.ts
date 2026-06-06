import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { AppLogger } from 'src/common/logger/logger';

describe('MembersController', () => {
  let controller: MembersController;
  let service: jest.Mocked<
    Pick<MembersService, 'create' | 'findAll' | 'findOne' | 'update' | 'delete'>
  >;

  const member = {
    id: '31c6ebd6-6038-4e2f-9096-6788305ef07c',
    firstName: 'John',
    lastName: 'Doe',
    gender: 'male',
    dateOfBirth: '1990-01-01',
    phone: '+201012345678',
    centralMemberId: null,
  };

  const paginatedResult = {
    data: [member],
    total: 1,
    page: 1,
    limit: 20,
    totalPages: 1,
  };

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembersController],
      providers: [
        { provide: MembersService, useValue: service },
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

    controller = module.get<MembersController>(MembersController);
  });

  describe('create', () => {
    it('creates a member successfully', async () => {
      service.create.mockResolvedValue(member as any);

      await expect(controller.create(member as any)).resolves.toEqual(member);
      expect(service.create).toHaveBeenCalledWith(member);
    });
  });

  describe('findAll', () => {
    it('returns paginated members successfully', async () => {
      service.findAll.mockResolvedValue(paginatedResult as any);

      await expect(controller.findAll({ page: 1, limit: 20 })).resolves.toEqual(
        paginatedResult,
      );
      expect(service.findAll).toHaveBeenCalledWith({ page: 1, limit: 20 });
    });

    it('returns empty data when no members exist', async () => {
      service.findAll.mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
      } as any);

      await expect(controller.findAll({ page: 1, limit: 20 })).resolves.toEqual(
        {
          data: [],
          total: 0,
          page: 1,
          limit: 20,
          totalPages: 0,
        },
      );
    });
  });

  describe('findOne', () => {
    it('returns a member by ID successfully', async () => {
      service.findOne.mockResolvedValue(member as any);

      await expect(controller.findOne(member.id)).resolves.toEqual(member);
      expect(service.findOne).toHaveBeenCalledWith(member.id);
    });

    it('propagates NotFoundException when member is not found', async () => {
      service.findOne.mockRejectedValue(
        new NotFoundException('Member not found'),
      );

      await expect(controller.findOne(member.id)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('updates a member successfully', async () => {
      const updatedMember = { ...member, firstName: 'Updated' };
      service.update.mockResolvedValue(updatedMember as any);

      await expect(
        controller.update(member.id, { firstName: 'Updated' }),
      ).resolves.toEqual(updatedMember);
      expect(service.update).toHaveBeenCalledWith(member.id, {
        firstName: 'Updated',
      });
    });

    it('propagates NotFoundException when member to update is not found', async () => {
      service.update.mockRejectedValue(
        new NotFoundException('Member not found'),
      );

      await expect(
        controller.update(member.id, { firstName: 'Updated' }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
  describe('delete', () => {
    it('deletes a member successfully', async () => {
      service.delete.mockResolvedValue(undefined);

      await expect(controller.delete(member.id)).resolves.toBeUndefined();
      expect(service.delete).toHaveBeenCalledWith(member.id);
    });

    it('propagates NotFoundException when member to delete is not found', async () => {
      service.delete.mockRejectedValue(
        new NotFoundException('Member not found'),
      );

      await expect(controller.delete(member.id)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
