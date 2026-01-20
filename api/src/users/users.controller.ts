import { Controller, Get, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { Roles, RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getProfile(@CurrentUser() user: any) {
    return this.usersService.findById(user.id);
  }

  @Patch('me')
  async updateProfile(@CurrentUser() user: any, @Body() updateUserDto: any) {
    return this.usersService.update(user.id, updateUserDto);
  }

  @Get('ongs')
  async getAllOngs() {
    return this.usersService.findAll('ong');
  }

  @Get('ong/:id/statistics')
  @UseGuards(RolesGuard)
  @Roles('ong')
  async getOngStatistics(@Param('id') id: string, @CurrentUser() user: any) {
    // Ensure user can only access their own statistics
    if (user.id !== id && user.user_type !== 'admin') {
      return this.usersService.getOngStatistics(user.id);
    }
    return this.usersService.getOngStatistics(id);
  }
}
