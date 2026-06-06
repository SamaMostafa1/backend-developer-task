import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Patch,
  Query,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDTO } from './dto/create-member.dto';
import { UpdateMemberDTO } from './dto/update-member.dto';
import { MemberDTO } from './dto/member.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponse } from 'src/common/interfaces/pagination-respones.interface';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  async create(@Body() createMemberDto: CreateMemberDTO): Promise<MemberDTO> {
    return this.membersService.create(createMemberDto);
  }

  @Get()
  async findAll(@Query() query:PaginationDto ): Promise<PaginatedResponse<MemberDTO>> {
    return this.membersService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<MemberDTO> {
    return this.membersService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMemberDto: UpdateMemberDTO,
  ): Promise<MemberDTO> {
    return this.membersService.update(id, updateMemberDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.membersService.delete(id);
  }
}
