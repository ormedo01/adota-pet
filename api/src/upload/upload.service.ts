import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { randomUUID } from 'crypto';

@Injectable()
export class UploadService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async uploadPetImage(file: Express.Multer.File): Promise<string> {
    try {
      const supabase = this.supabaseService.getClient();
      
      // Gerar nome único para o arquivo usando crypto nativo do Node
      const fileExt = file.originalname.split('.').pop();
      const fileName = `${randomUUID()}.${fileExt}`;
      const filePath = `pets/${fileName}`;

      // Upload para o Supabase Storage
      const { data, error } = await supabase.storage
        .from('pet-images')
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (error) {
        throw new InternalServerErrorException(`Erro ao fazer upload: ${error.message}`);
      }

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('pet-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      throw new InternalServerErrorException(`Falha no upload da imagem: ${error.message}`);
    }
  }

  async deleteImage(imageUrl: string): Promise<void> {
    try {
      const supabase = this.supabaseService.getClient();
      
      // Extrair o caminho do arquivo da URL
      const urlParts = imageUrl.split('/storage/v1/object/public/pet-images/');
      if (urlParts.length < 2) {
        throw new Error('URL inválida');
      }
      
      const filePath = urlParts[1];

      const { error } = await supabase.storage
        .from('pet-images')
        .remove([filePath]);

      if (error) {
        throw new InternalServerErrorException(`Erro ao deletar imagem: ${error.message}`);
      }
    } catch (error) {
      throw new InternalServerErrorException(`Falha ao deletar imagem: ${error.message}`);
    }
  }
}
