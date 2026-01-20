import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { FilterPetsDto } from './dto/filter-pets.dto';

@Injectable()
export class PetsService {
  constructor(private supabaseService: SupabaseService) {}

  async create(ongId: string, createPetDto: CreatePetDto) {
    const supabase = this.supabaseService.getClient();

    // Mapear os campos recebidos para os campos do banco
    const { photos, city, state, temperament, ...restDto } = createPetDto;

    const petData = {
      ...restDto,
      ong_id: ongId,
      // Mapear 'photos' para 'additional_images' (campo que existe no banco)
      additional_images: photos || createPetDto.additional_images,
      // Mapear 'temperament' para 'personality' (campo que existe no banco)
      personality: temperament || createPetDto.personality,
      // city e state são ignorados pois vêm da ONG, não do pet
    };

    const { data, error } = await supabase
      .from('pets')
      .insert(petData)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar pet: ${error.message}`);
    }

    return data;
  }

  async findAll(filters?: FilterPetsDto) {
    const supabase = this.supabaseService.getClient();

    let query = supabase
      .from('pets_with_ong')
      .select('*')
      .in('status', ['available', 'in_process']);

    if (filters?.species) {
      query = query.eq('species', filters.species);
    }

    if (filters?.size) {
      query = query.eq('size', filters.size);
    }

    if (filters?.ong_id) {
      query = query.eq('ong_id', filters.ong_id);
    }

    if (filters?.city) {
      query = query.ilike('ong_city', `%${filters.city}%`);
    }

    if (filters?.state) {
      query = query.eq('ong_state', filters.state);
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,breed.ilike.%${filters.search}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erro ao buscar pets: ${error.message}`);
    }

    return data || [];
  }

  async findById(id: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('pets_with_ong')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException('Pet não encontrado');
    }

    return data;
  }

  async findByOng(ongId: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('ong_id', ongId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erro ao buscar pets da ONG: ${error.message}`);
    }

    return data || [];
  }

  async update(id: string, userId: string, userType: string, updatePetDto: UpdatePetDto) {
    const supabase = this.supabaseService.getClient();

    // Verify ownership if user is ONG
    if (userType === 'ong') {
      const { data: pet } = await supabase
        .from('pets')
        .select('ong_id')
        .eq('id', id)
        .single();

      if (!pet || pet.ong_id !== userId) {
        throw new ForbiddenException('Você não tem permissão para editar este pet');
      }
    }

    // Mapear os campos recebidos para os campos do banco (mesmo do create)
    const { photos, city, state, temperament, ...restDto } = updatePetDto;

    const petData = {
      ...restDto,
      // Mapear 'photos' para 'additional_images' (campo que existe no banco)
      ...(photos && { additional_images: photos }),
      // Mapear 'temperament' para 'personality' (campo que existe no banco)
      ...(temperament && { personality: temperament }),
      // city e state são ignorados pois vêm da ONG, não do pet
    };

    console.log('Update - DTO recebido:', updatePetDto);
    console.log('Update - Dados transformados:', petData);

    const { data, error } = await supabase
      .from('pets')
      .update(petData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar pet:', error);
      throw new Error(`Erro ao atualizar pet: ${error.message}`);
    }

    if (!data) {
      throw new NotFoundException('Pet não encontrado');
    }

    return data;
  }

  async remove(id: string, userId: string, userType: string) {
    const supabase = this.supabaseService.getClient();

    // Verify ownership if user is ONG
    if (userType === 'ong') {
      const { data: pet } = await supabase
        .from('pets')
        .select('ong_id')
        .eq('id', id)
        .single();

      if (!pet || pet.ong_id !== userId) {
        throw new ForbiddenException('Você não tem permissão para remover este pet');
      }
    }

    const { error } = await supabase.from('pets').delete().eq('id', id);

    if (error) {
      throw new Error(`Erro ao remover pet: ${error.message}`);
    }

    return { message: 'Pet removido com sucesso' };
  }

  async updateStatus(id: string, status: string, userId: string, userType: string) {
    const supabase = this.supabaseService.getClient();

    // Verify ownership
    if (userType === 'ong') {
      const { data: pet } = await supabase
        .from('pets')
        .select('ong_id')
        .eq('id', id)
        .single();

      if (!pet || pet.ong_id !== userId) {
        throw new ForbiddenException('Você não tem permissão para alterar o status deste pet');
      }
    }

    const { data, error } = await supabase
      .from('pets')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao atualizar status: ${error.message}`);
    }

    return data;
  }
}
