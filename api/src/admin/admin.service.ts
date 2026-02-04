import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { RegisterDto } from '../auth/dto/register.dto';
import { CreatePetDto } from '../pets/dto/create-pet.dto';
import * as bcrypt from 'bcrypt';
import { PetsService } from '../pets/pets.service';

@Injectable()
export class AdminService {
    constructor(
        private supabaseService: SupabaseService,
        private petsService: PetsService
    ) { }

    private getClient() {
        return this.supabaseService.getClient();
    }

    // ... (rest of the class)

    async createPet(ongId: string, createPetDto: CreatePetDto) {
        // Delegate to PetsService which already handles validation and mapping logic correctly
        return this.petsService.create(ongId, createPetDto);
    }

    async getDashboardStats() {
        const supabase = this.getClient();

        // Execute queries in parallel for better performance
        const [
            { count: ongsCount },
            { count: adoptersCount },
            { count: totalPets },
            { count: availablePets },
            { count: inProcessPets },
            { count: adoptedPets },
        ] = await Promise.all([
            supabase.from('users').select('*', { count: 'exact', head: true }).eq('user_type', 'ong'),
            supabase.from('users').select('*', { count: 'exact', head: true }).eq('user_type', 'adopter'),
            supabase.from('pets').select('*', { count: 'exact', head: true }),
            supabase.from('pets').select('*', { count: 'exact', head: true }).eq('status', 'available'),
            supabase.from('pets').select('*', { count: 'exact', head: true }).eq('status', 'in_process'),
            supabase.from('pets').select('*', { count: 'exact', head: true }).eq('status', 'adopted'),
        ]);

        return {
            ongs: ongsCount || 0,
            adopters: adoptersCount || 0,
            total_pets: totalPets || 0,
            available_pets: availablePets || 0,
            in_process_pets: inProcessPets || 0,
            adopted_pets: adoptedPets || 0,
        };
    }

    async getAllUsers() {
        const supabase = this.getClient();

        const { data, error } = await supabase
            .from('users')
            .select('id, name, email, user_type, phone, city, state, is_active, created_at')
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);
        return data;
    }

    async createUser(createUserDto: RegisterDto) {
        const supabase = this.getClient();

        // Check existing email
        const { data: existing } = await supabase
            .from('users')
            .select('id')
            .eq('email', createUserDto.email)
            .single();

        if (existing) throw new Error('Email já cadastrado');

        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        const userToCreate = { ...createUserDto };
        delete userToCreate.password;

        const { data, error } = await supabase
            .from('users')
            .insert({
                ...userToCreate,
                password_hash: hashedPassword,
            })
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data;
    }

    async updateUser(id: string, updateData: any) {
        const supabase = this.getClient();

        // Se houver senha, fazer hash
        if (updateData.password) {
            updateData.password_hash = await bcrypt.hash(updateData.password, 10);
            delete updateData.password;
        }

        const { data, error } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data;
    }

    async deleteUser(id: string) {
        const supabase = this.getClient();
        const { error } = await supabase.from('users').delete().eq('id', id);
        if (error) throw new Error(error.message);
        return { message: 'Usuário removido com sucesso' };
    }

    async getAllPets() {
        const supabase = this.getClient();

        // Using pets_with_ong view to get ONG name
        const { data, error } = await supabase
            .from('pets_with_ong')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);
        return data;
    }



    async updatePet(id: string, petData: any) {
        const supabase = this.getClient();

        // 1. Clean the payload
        const { photos, city, state, temperament, ...restDto } = petData;

        // 2. Map to DB schema
        const dbPayload: any = {
            ...restDto,
        };

        if (photos || petData.additional_images) {
            dbPayload.additional_images = photos || petData.additional_images;
        }

        if (temperament || petData.personality) {
            dbPayload.personality = temperament || petData.personality;
        }

        if (petData.image_url) {
            dbPayload.image_url = petData.image_url;
        } else if (photos && photos.length > 0) {
            dbPayload.image_url = photos[0]; // Auto-set main image if photos are updated
        }

        const { data, error } = await supabase
            .from('pets')
            .update(dbPayload)
            .eq('id', id)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data;
    }

    async deletePet(id: string) {
        const supabase = this.getClient();
        const { error } = await supabase.from('pets').delete().eq('id', id);
        if (error) throw new Error(error.message);
        return { message: 'Pet removido com sucesso' };
    }
}
