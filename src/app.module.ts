import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { CustomThrottlerGuard } from './common/guards/custom-throttler.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Email } from './mailer/email.entity';
import { Service } from './services/service.entity';
import { MailerModule } from './mailer/mailer.module';
import { RecaptchaModule } from './recaptcha/recaptcha.module';
import { APP_GUARD } from '@nestjs/core';
import { SouthernCartographerController } from './services/southern-cartographer/southern-cartographer.controller';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      name: 'default',
      ttl: 60000,
      limit: 10,
    }]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'tand_CAMP69@_postgresql',
      database: 'pie_api',
      entities: [Email, Service],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Email, Service]),
    RecaptchaModule,
    MailerModule,
    ServicesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
  controllers: [SouthernCartographerController]
})
export class AppModule {}