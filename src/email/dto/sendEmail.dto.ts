import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendEmailDto {
  @IsEmail()
  @IsNotEmpty()
  to: string;
  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsOptional()
  text: string;

  @IsString()
  @IsOptional()
  name: string;
}
