import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MembersModule } from './modules/members/members.module';
import { ProductsModule } from './modules/products/products.module';
import { ShopsModule } from './modules/shops/shops.module';
import { JoiPipeModule } from 'nestjs-joi';
import { LoggerModule } from './common/logger/logger.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        dialect: 'postgres',
        uri: config.get<string>('DATABASE_URL'),
        sync: { alter: true },
        autoLoadModels: true,
        logging: false,
      }),
    }),
    JoiPipeModule.forRoot({
      pipeOpts: {
        defaultValidationOptions: {
          abortEarly: false,
          allowUnknown: false,
        },
      },
    }),
    MembersModule,
    ProductsModule,
    ShopsModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
