import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request, Patch } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RegisterDto } from '../auth/dto/register.dto';

import { AdminCreatePetDto } from './dto/admin-create-pet.dto';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin')
@ApiBearerAuth()
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('dashboard')
    @ApiOperation({ summary: 'Estatísticas para o dashboard admin' })
    getDashboard() {
        return this.adminService.getDashboardStats();
    }

    @Get('users')
    @ApiOperation({ summary: 'Listar todos os usuários' })
    getAllUsers() {
        return this.adminService.getAllUsers();
    }

    @Post('users')
    @ApiOperation({ summary: 'Criar novo usuário (Admin)' })
    createUser(@Body() createUserDto: RegisterDto) {
        return this.adminService.createUser(createUserDto);
    }

    @Delete('users/:id')
    @ApiOperation({ summary: 'Remover usuário' })
    deleteUser(@Param('id') id: string) {
        return this.adminService.deleteUser(id);
    }

    @Get('pets')
    @ApiOperation({ summary: 'Listar todos os pets' })
    getAllPets() {
        return this.adminService.getAllPets();
    }

    @Post('pets')
    @ApiOperation({ summary: 'Criar novo pet (Admin)' })
    createPet(@Body() petData: AdminCreatePetDto) {
        const { ong_id, ...createPetDto } = petData;
        return this.adminService.createPet(ong_id, createPetDto);
    }

    @Patch('pets/:id')
    @ApiOperation({ summary: 'Atualizar pet' })
    updatePet(@Param('id') id: string, @Body() petData: any) {
        return this.adminService.updatePet(id, petData);
    }

    @Delete('pets/:id')
    @ApiOperation({ summary: 'Remover pet' })
    deletePet(@Param('id') id: string) {
        return this.adminService.deletePet(id);
    }

    @Patch('users/:id')
    @ApiOperation({ summary: 'Atualizar usuário' })
    updateUser(@Param('id') id: string, @Body() updateData: any) {
        return this.adminService.updateUser(id, updateData);
    }
}
