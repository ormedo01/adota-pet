import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class UsersService {
  constructor(private supabaseService: SupabaseService) {}

  async create(createUserDto: any) {
    const supabase = this.supabaseService.getClient();

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', createUserDto.email)
      .single();

    if (existingUser) {
      throw new ConflictException('Email já cadastrado');
    }

    // Check CPF/CNPJ if provided
    if (createUserDto.cpf) {
      const { data: existingCpf } = await supabase
        .from('users')
        .select('id')
        .eq('cpf', createUserDto.cpf)
        .single();

      if (existingCpf) {
        throw new ConflictException('CPF já cadastrado');
      }
    }

    if (createUserDto.cnpj) {
      const { data: existingCnpj } = await supabase
        .from('users')
        .select('id')
        .eq('cnpj', createUserDto.cnpj)
        .single();

      if (existingCnpj) {
        throw new ConflictException('CNPJ já cadastrado');
      }
    }

    const { data, error } = await supabase
      .from('users')
      .insert(createUserDto)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar usuário: ${error.message}`);
    }

    return data;
  }

  async findById(id: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return data;
  }

  async findByEmailAndType(email: string, userType: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('user_type', userType)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Erro ao buscar usuário: ${error.message}`);
    }

    return data;
  }

  async findAll(userType?: string) {
    const supabase = this.supabaseService.getClient();

    let query = supabase.from('users').select('*').eq('is_active', true);

    if (userType) {
      query = query.eq('user_type', userType);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Erro ao buscar usuários: ${error.message}`);
    }

    return data;
  }

  async update(id: string, updateUserDto: any) {
    const supabase = this.supabaseService.getClient();

    // Remove fields that shouldn't be updated
    const { password_hash, email, user_type, ...updateData } = updateUserDto;

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao atualizar usuário: ${error.message}`);
    }

    if (!data) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return data;
  }

  async getOngStatistics(ongId: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('ong_statistics')
      .select('*')
      .eq('ong_id', ongId)
      .single();

    if (error) {
      throw new Error(`Erro ao buscar estatísticas: ${error.message}`);
    }

    return data || {
      ong_id: ongId,
      total_pets: 0,
      available_pets: 0,
      adopted_pets: 0,
      total_applications: 0,
      pending_applications: 0,
      approved_applications: 0,
    };
  }
}
