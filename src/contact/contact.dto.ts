import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class ContactDto {
  @IsNotEmpty({ message: 'Name is required' })
  @Length(2, 50, { message: 'Name must be between 2 and 50 characters' })
  name: string;

  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsNotEmpty({ message: 'Message is required' })
  @Length(1, 1000, { message: 'Message must be between 1 and 1000 characters' })
  message: string;
}
