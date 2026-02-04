import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreatePetDto } from '../../pets/dto/create-pet.dto';

export class AdminCreatePetDto extends CreatePetDto {
    @ApiProperty({ example: 'ee4d596f-09a8-41d3-9920-af13b1141670', description: 'ID da ONG responsável' })
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    ong_id: string;
}
