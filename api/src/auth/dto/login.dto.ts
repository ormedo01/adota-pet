import { IsEmail, IsString, MinLength, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'contato@patinhasfelizes.org',
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
    example: 'ong',
    description: 'Tipo de usuário',
    enum: ['adopter', 'ong', 'admin']
  })
  @IsString()
  @IsIn(['adopter', 'ong', 'admin'], { message: 'Tipo de usuário deve ser adopter, ong ou admin' })
  user_type: 'adopter' | 'ong' | 'admin';
}
