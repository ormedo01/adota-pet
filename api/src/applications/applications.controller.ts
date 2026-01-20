import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { Roles, RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('applications')
@UseGuards(AuthGuard('jwt'))
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('adopter')
  create(@CurrentUser() user: any, @Body() createApplicationDto: CreateApplicationDto) {
    return this.applicationsService.create(user.id, createApplicationDto);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.applicationsService.findAll(user.id, user.user_type);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.applicationsService.findById(id, user.id, user.user_type);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles('ong')
  updateStatus(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateStatusDto: UpdateApplicationStatusDto,
  ) {
    return this.applicationsService.updateStatus(
      id,
      user.id,
      user.user_type,
      updateStatusDto.status,
      updateStatusDto.notes,
      updateStatusDto.rejection_reason,
    );
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('adopter')
  cancel(@Param('id') id: string, @CurrentUser() user: any) {
    return this.applicationsService.cancel(id, user.id);
  }

  @Get('pet/:petId/stats')
  @UseGuards(RolesGuard)
  @Roles('ong')
  getStatsByPet(@Param('petId') petId: string) {
    return this.applicationsService.getStatsByPet(petId);
  }
}
