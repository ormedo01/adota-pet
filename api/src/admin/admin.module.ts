import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { SupabaseModule } from '../supabase/supabase.module';

import { PetsModule } from '../pets/pets.module';

@Module({
    imports: [SupabaseModule, PetsModule],
    controllers: [AdminController],
    providers: [AdminService],
})
export class AdminModule { }
