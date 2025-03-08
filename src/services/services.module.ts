import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './service.entity';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller'; // Import the new controller
import { SouthernCartographerController } from './southern-cartographer/southern-cartographer.controller';
import { MailerModule } from '../mailer/mailer.module';
import { RecaptchaModule } from '../recaptcha/recaptcha.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service]),
    MailerModule,
    RecaptchaModule
  ],
  providers: [ServicesService],
  controllers: [
    ServicesController, // Add the new controller
    SouthernCartographerController
  ],
  exports: [
    ServicesService, 
    MailerModule,
    RecaptchaModule
  ]
})
export class ServicesModule {}