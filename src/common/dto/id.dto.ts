import { IsString } from 'class-validator';

export class IdDto {
  @IsString()
  id: string;
}
