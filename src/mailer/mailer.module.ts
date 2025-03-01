// src/mailer/mailer.module.ts
import { Module } from '@nestjs/common';
import { MailerController } from './mailer.controller';
import { MailerService } from './mailer.service';
import { RecaptchaModule } from '../recaptcha/recaptcha.module'; // Adjust path as needed

@Module({
  imports: [RecaptchaModule],
  controllers: [MailerController],
  providers: [MailerService]
})
export class MailerModule {}