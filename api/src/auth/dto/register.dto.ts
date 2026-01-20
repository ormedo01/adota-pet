import { IsEmail, IsString, MinLength, IsIn, IsOptional, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ 
    example: 'usuario@email.com',
    description: 'Email do usuário'
  })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiProperty({ 
    example: 'senha123',
    description: 'Senha do usuário',
    minLength: 6
  })
  @IsString()
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  password: string;

  @ApiProperty({ 
    example: 'João Silva',
    description: 'Nome completo do usuário'
  })
  @IsString()
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
  name: string;

  @ApiProperty({ 
    example: 'adopter',
    description: 'Tipo de usuário',
    enum: ['adopter', 'ong']
  })
  @IsString()
  @IsIn(['adopter', 'ong'], { message: 'Tipo de usuário deve ser adopter ou ong' })
  user_type: 'adopter' | 'ong';

  @ApiProperty({ 
    example: '(11) 99999-9999',
    description: 'Telefone',
    required: false
  })
  @IsOptional()
  @IsString()
  phone?: string;

  // Campos para ONG
  @ApiProperty({ 
    example: '12.345.678/0001-90',
    description: 'CNPJ (obrigatório para ONGs)',
    required: false
  })
  @ValidateIf((o) => o.user_type === 'ong')
  @IsString({ message: 'CNPJ é obrigatório para ONGs' })
  cnpj?: string;

  @ApiProperty({ 
    example: 'ONG dedicada ao resgate de animais',
    description: 'Descrição da ONG',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Rua ABC, 123', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'São Paulo', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: 'SP', required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ example: '01234-567', required: false })
  @IsOptional()
  @IsString()
  zip_code?: string;

  @ApiProperty({ example: 'https://ong.org.br', required: false })
  @IsOptional()
  @IsString()
  website?: string;

  // Campos para Adotante
  @ApiProperty({ 
    example: '123.456.789-00',
    description: 'CPF (obrigatório para adotantes)',
    required: false
  })
  @ValidateIf((o) => o.user_type === 'adopter')
  @IsString({ message: 'CPF é obrigatório para adotantes' })
  cpf?: string;

  @ApiProperty({ example: '1990-01-01', required: false })
  @IsOptional()
  @IsString()
  birth_date?: string;
}
