import { IsOptional, IsString, IsIn } from 'class-validator';

export class FilterPetsDto {
  @IsOptional()
  @IsString()
  @IsIn(['dog', 'cat', 'other'])
  species?: 'dog' | 'cat' | 'other';

  @IsOptional()
  @IsString()
  @IsIn(['small', 'medium', 'large'])
  size?: 'small' | 'medium' | 'large';

  @IsOptional()
  @IsString()
  ong_id?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
