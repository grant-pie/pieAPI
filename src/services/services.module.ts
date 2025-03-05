import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './service.entity';
import { ServicesService } from './services.service';
import { SouthernCartographerController } from './southern-cartographer/southern-cartographer.controller';
import { MailerModule } from '../mailer/mailer.module'; // Import MailerModule
import { RecaptchaModule } from '../recaptcha/recaptcha.module'; // Import RecaptchaModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Service]),
    MailerModule, // Add MailerModule
    RecaptchaModule // Add RecaptchaModule
  ],
  providers: [ServicesService],
  controllers: [SouthernCartographerController],
  exports: [
    ServicesService, 
    MailerModule, // Export MailerModule
    RecaptchaModule // Export RecaptchaModule
  ]
})
export class ServicesModule {}