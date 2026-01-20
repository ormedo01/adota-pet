import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class FavoritesService {
  constructor(private supabaseService: SupabaseService) {}

  async addFavorite(userId: string, petId: string) {
    const supabase = this.supabaseService.getClient();

    // Verify pet exists
    const { data: pet } = await supabase
      .from('pets')
      .select('id')
      .eq('id', petId)
      .single();

    if (!pet) {
      throw new NotFoundException('Pet não encontrado');
    }

    // Check if already favorited
    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('pet_id', petId)
      .single();

    if (existing) {
      throw new ConflictException('Pet já está nos favoritos');
    }

    const { data, error } = await supabase
      .from('favorites')
      .insert({
        user_id: userId,
        pet_id: petId,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao adicionar favorito: ${error.message}`);
    }

    return data;
  }

  async removeFavorite(userId: string, petId: string) {
    const supabase = this.supabaseService.getClient();

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('pet_id', petId);

    if (error) {
      throw new Error(`Erro ao remover favorito: ${error.message}`);
    }

    return { message: 'Favorito removido com sucesso' };
  }

  async findAllByUser(userId: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('favorites')
      .select(`
        id,
        created_at,
        pet:pets (
          id,
          name,
          species,
          breed,
          age_years,
          age_months,
          size,
          image_url,
          status,
          ong:users (
            id,
            name,
            city,
            state
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erro ao buscar favoritos: ${error.message}`);
    }

    return data || [];
  }

  async isFavorited(userId: string, petId: string): Promise<boolean> {
    const supabase = this.supabaseService.getClient();

    const { data } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('pet_id', petId)
      .single();

    return !!data;
  }

  async getFavoriteIds(userId: string): Promise<string[]> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('favorites')
      .select('pet_id')
      .eq('user_id', userId);

    if (error) {
      return [];
    }

    return data?.map((f) => f.pet_id) || [];
  }
}
