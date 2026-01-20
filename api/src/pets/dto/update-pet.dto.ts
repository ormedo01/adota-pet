import { PartialType } from '@nestjs/mapped-types';
import { CreatePetDto } from './create-pet.dto';
import { IsOptional, IsIn, IsString } from 'class-validator';

export class UpdatePetDto extends PartialType(CreatePetDto) {
  @IsOptional()
  @IsString()
  @IsIn(['available', 'in_process', 'adopted', 'unavailable'])
  status?: 'available' | 'in_process' | 'adopted' | 'unavailable';
}
