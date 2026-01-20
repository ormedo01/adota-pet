import { Controller, Get, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FavoritesService } from './favorites.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles, RolesGuard } from '../auth/guards/roles.guard';

@Controller('favorites')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('adopter')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.favoritesService.findAllByUser(user.id);
  }

  @Get('ids')
  getFavoriteIds(@CurrentUser() user: any) {
    return this.favoritesService.getFavoriteIds(user.id);
  }

  @Post(':petId')
  addFavorite(@CurrentUser() user: any, @Param('petId') petId: string) {
    return this.favoritesService.addFavorite(user.id, petId);
  }

  @Delete(':petId')
  removeFavorite(@CurrentUser() user: any, @Param('petId') petId: string) {
    return this.favoritesService.removeFavorite(user.id, petId);
  }

  @Get('check/:petId')
  checkFavorite(@CurrentUser() user: any, @Param('petId') petId: string) {
    return this.favoritesService.isFavorited(user.id, petId);
  }
}
