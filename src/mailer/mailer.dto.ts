// create-mail.dto.ts
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class MailerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500, { message: 'Message is too long. Maximum allowed is 500 characters.' })
  message: string;
}
