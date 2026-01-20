import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL and Service Key must be defined in environment variables');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  // Helper methods for common operations
  async query(table: string) {
    return this.supabase.from(table);
  }

  async insert(table: string, data: any) {
    return this.supabase.from(table).insert(data).select();
  }

  async update(table: string, id: string, data: any) {
    return this.supabase.from(table).update(data).eq('id', id).select();
  }

  async delete(table: string, id: string) {
    return this.supabase.from(table).delete().eq('id', id);
  }

  async findById(table: string, id: string) {
    return this.supabase.from(table).select('*').eq('id', id).single();
  }

  async findOne(table: string, filters: Record<string, any>) {
    let query = this.supabase.from(table).select('*');
    
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });

    return query.single();
  }

  // Storage helpers
  async uploadFile(bucket: string, path: string, file: Buffer, contentType?: string) {
    return this.supabase.storage.from(bucket).upload(path, file, {
      contentType,
      upsert: true,
    });
  }

  getPublicUrl(bucket: string, path: string): string {
    const { data } = this.supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }
}
