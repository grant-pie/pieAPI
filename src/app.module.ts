// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from './mailer/mailer.module';
import { RecaptchaModule } from './recaptcha/recaptcha.module';
// Import other modules as needed

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available throughout the application
    }),
    RecaptchaModule,
    MailerModule,
    // Other modules...
  ],
})
export class AppModule {}