import { IsString, IsOptional } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
