import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';

import { CreateMemberDTO } from 'src/modules/members/dto/create-member.dto';
import { MemberDTO } from 'src/modules/members/dto/member.dto';
import { UpdateMemberDTO } from 'src/modules/members/dto/update-member.dto';
import { MembersRepository } from 'src/modules/members/members.repository';
import { AppLogger } from 'src/common/logger/logger';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponse } from 'src/common/interfaces/pagination-respones.interface';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';


@Injectable()
export class MembersService {
  constructor(
    private readonly repository: MembersRepository,
    private readonly logger: AppLogger,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}
  private async validateCentralMember(centralMemberId: string): Promise<void> {
  const centralMember = await this.repository.findOne(centralMemberId);

  if (!centralMember) {
    throw new NotFoundException('Central member not found');
  }
  if (centralMember.centralMemberId) {
    throw new BadRequestException('A family member cannot be a central member');
  }
}

  /**
   * This method creates a new member
   * @param member - The member to create
   * @returns The created member
   */
  async create(member: CreateMemberDTO): Promise<MemberDTO> {
    if(member.centralMemberId){
    await this.validateCentralMember(member.centralMemberId);
    }
    try {
    
      const createdMember = await this.repository.create(member);
      this.logger.debug(
        `Created member with ID: ${createdMember.id}`,
        'MembersService',
      );
      await this.cacheManager.clear()
      return createdMember;
    } catch (error: any) {
      this.logger.error('Error creating member', error, 'MembersService');
      throw error;
    }
  }
  /**
   * This method finds all members
   * FIXME: A club can have more than 100k members, wow!
   * Can we find a way to return the members in an efficient way?
   */
  async findAll(query: PaginationDto): Promise<PaginatedResponse<MemberDTO>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const offset = (page - 1) * limit;
    const cacheKey = `members:page=${page}:limit=${limit}`;

    const cached =
      await this.cacheManager.get<PaginatedResponse<MemberDTO>>(cacheKey);

    if (cached) {
      this.logger.debug(
        `Cache HIT — returning cached members | key: ${cacheKey}`,
        'MembersService',
      );
      return cached;
    }

    this.logger.debug('Cache MISS — querying database', 'MembersService');

    try {
      const { rows, count } = await this.repository.findAll(limit, offset);

      const result: PaginatedResponse<MemberDTO> = {
        data: rows,
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      };
      await this.cacheManager.set(cacheKey, result, 60000);

      return result;
    } catch (error: any) {
      this.logger.error(
        'Failed to fetch members',
        error?.stack || error?.message || error,
        'MembersService',
      );

      throw error;
    }
  }

  async findOne(id: string): Promise<MemberDTO> {
    try {
      const member =await this.repository.findOne(id);
      if (!member) {
        this.logger.warn(
          `Member with ID: ${id} not found `,
          'MembersService',
        );
        throw new NotFoundException('Member not found');
      }
      return member;
    } catch (error: any) {
      this.logger.error('Error getting member', error, 'MembersService');
      throw error;
    }
  }

  async update(id: string, member: UpdateMemberDTO): Promise<MemberDTO> {
    try {
      const updatedMember = await this.repository.update(id, member);
      if (!updatedMember) {
        this.logger.warn(
          `Member with ID: ${id} not found for update`,
          'MembersService',
        );
        throw new NotFoundException('Member not found');
      }

      await this.cacheManager.clear()

      this.logger.debug(`Updated member with ID: ${id}`, 'MembersService');
      return updatedMember;
    } catch (error: any) {
      this.logger.error('Error updating member', error, 'MembersService');
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const deleted = await this.repository.delete(id);
      if (!deleted) {
        this.logger.warn(
          `Member with ID: ${id} not found for deletion`,
          'MembersService',
        );
        throw new NotFoundException('Member not found');
      }
      await this.cacheManager.clear();

      this.logger.debug(`Deleted member with ID: ${id}`, 'MembersService');
    } catch (error: any) {
      this.logger.error('Error deleting member', error, 'MembersService');
      throw error;
    }
  }
}
