import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { FilterPetsDto } from './dto/filter-pets.dto';
import { Roles, RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('pets')
@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ong')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cadastrar novo pet (apenas ONGs)' })
  @ApiResponse({ status: 201, description: 'Pet cadastrado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Apenas ONGs podem cadastrar pets' })
  create(@CurrentUser() user: any, @Body() createPetDto: CreatePetDto) {
    return this.petsService.create(user.id, createPetDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar pets disponíveis (público)' })
  @ApiResponse({ status: 200, description: 'Lista de pets' })
  @ApiQuery({ name: 'species', required: false, enum: ['dog', 'cat', 'other'] })
  @ApiQuery({ name: 'size', required: false, enum: ['small', 'medium', 'large'] })
  @ApiQuery({ name: 'city', required: false })
  @ApiQuery({ name: 'search', required: false })
  findAll(@Query() filters: FilterPetsDto) {
    return this.petsService.findAll(filters);
  }

  @Get('my-pets')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ong')
  findMyPets(@CurrentUser() user: any) {
    return this.petsService.findByOng(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.petsService.findById(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ong')
  async update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updatePetDto: UpdatePetDto,
  ) {
    try {
      return await this.petsService.update(id, user.id, user.user_type, updatePetDto);
    } catch (error) {
      console.error('Controller - Erro ao atualizar pet:', error);
      throw error;
    }
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ong')
  updateStatus(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body('status') status: string,
  ) {
    return this.petsService.updateStatus(id, status, user.id, user.user_type);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ong')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.petsService.remove(id, user.id, user.user_type);
  }
}
