import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Length,
    Matches
} from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Matches(/^\+?\d+$/)
  @Length(10, 15)
  cellphone: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 20)
  identification: string;
}
