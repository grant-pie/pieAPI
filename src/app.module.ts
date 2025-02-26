import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailerModule } from './mailer/mailer.module';
import { MailerService } from './mailer/mailer.service';

@Module({
  imports: [MailerModule],
  controllers: [AppController],
  providers: [AppService, MailerService],
})
export class AppModule {}
