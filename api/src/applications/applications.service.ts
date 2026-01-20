import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateApplicationDto } from './dto/create-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(private supabaseService: SupabaseService) {}

  async create(adopterId: string, createApplicationDto: CreateApplicationDto) {
    const supabase = this.supabaseService.getClient();

    // Check if pet exists and is available
    const { data: pet } = await supabase
      .from('pets')
      .select('id, status')
      .eq('id', createApplicationDto.pet_id)
      .single();

    if (!pet) {
      throw new NotFoundException('Pet não encontrado');
    }

    if (pet.status !== 'available') {
      throw new BadRequestException('Este pet não está disponível para adoção');
    }

    // Check if user already has a pending application for this pet
    const { data: existingApp } = await supabase
      .from('adoption_applications')
      .select('id')
      .eq('pet_id', createApplicationDto.pet_id)
      .eq('adopter_id', adopterId)
      .in('status', ['pending', 'under_review', 'approved'])
      .single();

    if (existingApp) {
      throw new BadRequestException('Você já possui uma candidatura ativa para este pet');
    }

    const applicationData = {
      ...createApplicationDto,
      adopter_id: adopterId,
      status: 'pending',
    };

    const { data, error } = await supabase
      .from('adoption_applications')
      .insert(applicationData)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar candidatura: ${error.message}`);
    }

    return data;
  }

  async findAll(userId: string, userType: string) {
    const supabase = this.supabaseService.getClient();

    let query = supabase
      .from('applications_detailed')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (userType === 'adopter') {
      query = query.eq('adopter_id', userId);
    } else if (userType === 'ong') {
      // Get applications for pets owned by this ONG
      const { data: pets } = await supabase
        .from('pets')
        .select('id')
        .eq('ong_id', userId);

      const petIds = pets?.map((p) => p.id) || [];
      
      if (petIds.length > 0) {
        query = query.in('pet_id', petIds);
      } else {
        return [];
      }
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Erro ao buscar candidaturas: ${error.message}`);
    }

    return data || [];
  }

  async findById(id: string, userId: string, userType: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('applications_detailed')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException('Candidatura não encontrada');
    }

    // Verify access
    if (userType === 'adopter' && data.adopter_id !== userId) {
      throw new ForbiddenException('Você não tem permissão para visualizar esta candidatura');
    }

    if (userType === 'ong') {
      const { data: pet } = await supabase
        .from('pets')
        .select('ong_id')
        .eq('id', data.pet_id)
        .single();

      if (!pet || pet.ong_id !== userId) {
        throw new ForbiddenException('Você não tem permissão para visualizar esta candidatura');
      }
    }

    return data;
  }

  async updateStatus(
    id: string,
    userId: string,
    userType: string,
    status: string,
    notes?: string,
    rejectionReason?: string,
  ) {
    const supabase = this.supabaseService.getClient();

    // Only ONGs can update status
    if (userType !== 'ong') {
      throw new ForbiddenException('Apenas ONGs podem atualizar o status de candidaturas');
    }

    // Get application and verify ownership
    const { data: application } = await supabase
      .from('adoption_applications')
      .select('pet_id')
      .eq('id', id)
      .single();

    if (!application) {
      throw new NotFoundException('Candidatura não encontrada');
    }

    const { data: pet } = await supabase
      .from('pets')
      .select('ong_id')
      .eq('id', application.pet_id)
      .single();

    if (!pet || pet.ong_id !== userId) {
      throw new ForbiddenException('Você não tem permissão para atualizar esta candidatura');
    }

    const updateData: any = {
      status,
      reviewed_at: new Date().toISOString(),
    };

    if (notes) {
      updateData.ong_notes = notes;
    }

    if (rejectionReason && status === 'rejected') {
      updateData.rejection_reason = rejectionReason;
    }

    const { data, error } = await supabase
      .from('adoption_applications')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao atualizar candidatura: ${error.message}`);
    }

    return data;
  }

  async cancel(id: string, userId: string) {
    const supabase = this.supabaseService.getClient();

    // Verify ownership
    const { data: application } = await supabase
      .from('adoption_applications')
      .select('adopter_id, status')
      .eq('id', id)
      .single();

    if (!application) {
      throw new NotFoundException('Candidatura não encontrada');
    }

    if (application.adopter_id !== userId) {
      throw new ForbiddenException('Você não tem permissão para cancelar esta candidatura');
    }

    if (application.status === 'approved') {
      throw new BadRequestException('Não é possível cancelar uma candidatura já aprovada');
    }

    const { data, error } = await supabase
      .from('adoption_applications')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao cancelar candidatura: ${error.message}`);
    }

    return data;
  }

  async getStatsByPet(petId: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('adoption_applications')
      .select('status')
      .eq('pet_id', petId);

    if (error) {
      throw new Error(`Erro ao buscar estatísticas: ${error.message}`);
    }

    const stats = {
      total: data?.length || 0,
      pending: data?.filter((a) => a.status === 'pending').length || 0,
      under_review: data?.filter((a) => a.status === 'under_review').length || 0,
      approved: data?.filter((a) => a.status === 'approved').length || 0,
      rejected: data?.filter((a) => a.status === 'rejected').length || 0,
      cancelled: data?.filter((a) => a.status === 'cancelled').length || 0,
    };

    return stats;
  }
}
