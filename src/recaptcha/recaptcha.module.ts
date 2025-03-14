// src/recaptcha/recaptcha.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import RecaptchaService from './recaptcha.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    ConfigModule,
  ],
  providers: [RecaptchaService],
  exports: [RecaptchaService],
})
export class RecaptchaModule {}