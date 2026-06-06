import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Member } from 'src/modules/members/members.model';
import { MembersController } from 'src/modules/members/members.controller';
import { MembersService } from 'src/modules/members/members.service';
import { MembersRepository } from 'src/modules/members/members.repository';
import { LoggerModule } from 'src/common/logger/logger.module';

@Module({
  imports: [SequelizeModule.forFeature([Member]),LoggerModule],
  controllers: [MembersController],
  providers: [MembersService, MembersRepository],
  exports: [MembersService, MembersRepository],
})
export class MembersModule {}
