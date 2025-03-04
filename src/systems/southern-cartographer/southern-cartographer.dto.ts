// src/mailer/mailer.dto.ts
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SouthernCartographerDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  
  @IsNotEmpty()
  @IsEmail()
  email: string;
  
  @IsNotEmpty()
  @IsString()
  message: string;
  
  @IsNotEmpty()
  @IsString()
  recaptchaToken: string; // Field for the reCAPTCHA token from the frontend
}