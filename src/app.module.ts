import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailerModule } from './mailer/mailer.module';
import { MailerService } from './mailer/mailer.service';
import { RecaptchaService } from './recaptcha/recaptcha.service';
import { RecaptchaModule } from './recaptcha/recaptcha.module';

@Module({
  imports: [HttpModule, ConfigModule.forRoot(), MailerModule, RecaptchaModule],
  controllers: [AppController],
  providers: [AppService, MailerService, RecaptchaService],
})
export class AppModule {}
