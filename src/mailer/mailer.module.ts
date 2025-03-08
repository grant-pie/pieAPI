// src/mailer/mailer.module.ts
import { Module } from '@nestjs/common';
import { MailerController } from './mailer.controller';
import { MailerService } from './mailer.service';
import { RecaptchaModule } from '../recaptcha/recaptcha.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Email } from '../email/email.entity';

@Module({
  imports: [RecaptchaModule, TypeOrmModule.forFeature([Email])],
  controllers: [MailerController],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}