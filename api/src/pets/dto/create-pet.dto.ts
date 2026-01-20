import { IsString, IsIn, IsOptional, IsBoolean, IsInt, Min, IsUrl, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePetDto {
  @ApiProperty({ example: 'Thor', description: 'Nome do pet' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'dog', enum: ['dog', 'cat', 'other'], description: 'Espécie do animal' })
  @IsString()
  @IsIn(['dog', 'cat', 'other'])
  species: 'dog' | 'cat' | 'other';

  @ApiProperty({ example: 'Labrador', required: false })
  @IsOptional()
  @IsString()
  breed?: string;

  @ApiProperty({ example: 2, minimum: 0, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  age_years?: number;

  @ApiProperty({ example: 6, minimum: 0, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  age_months?: number;

  @ApiProperty({ example: 'large', enum: ['small', 'medium', 'large'], required: false })
  @IsOptional()
  @IsString()
  @IsIn(['small', 'medium', 'large'])
  size?: 'small' | 'medium' | 'large';

  @ApiProperty({ example: 'male', enum: ['male', 'female'], required: false })
  @IsOptional()
  @IsString()
  @IsIn(['male', 'female'])
  gender?: 'male' | 'female';

  @ApiProperty({ example: 'Cachorro muito carinhoso e brincalhão', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Brincalhão, energético, carinhoso', required: false })
  @IsOptional()
  @IsString()
  personality?: string;

  @ApiProperty({ example: 'Vacinado e castrado', required: false })
  @IsOptional()
  @IsString()
  health_info?: string;

  @ApiProperty({ example: 'Calmo, dócil, amigável', required: false })
  @IsOptional()
  @IsString()
  temperament?: string;

  @ApiProperty({ example: 'Nenhuma necessidade especial', required: false })
  @IsOptional()
  @IsString()
  special_needs?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  good_with_kids?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  good_with_pets?: boolean;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  needs_yard?: boolean;

  @ApiProperty({ example: 'https://exemplo.com/imagem.jpg', required: false })
  @IsOptional()
  @IsUrl()
  image_url?: string;

  @ApiProperty({ example: ['https://exemplo.com/imagem2.jpg'], required: false, type: [String] })
  @IsOptional()
  additional_images?: string[];

  @ApiProperty({ example: ['https://exemplo.com/foto1.jpg', 'https://exemplo.com/foto2.jpg'], required: false, type: [String] })
  @IsOptional()
  photos?: string[];

  @ApiProperty({ example: 'São Paulo', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: 'SP', required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ example: 'available', enum: ['available', 'in_process', 'adopted', 'unavailable'], required: false })
  @IsOptional()
  @IsString()
  @IsIn(['available', 'in_process', 'adopted', 'unavailable'])
  status?: 'available' | 'in_process' | 'adopted' | 'unavailable';
}
