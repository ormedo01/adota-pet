const { createClient } = require('@supabase/supabase-js');
require('dotenv/config');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testStorage() {
  console.log('🧪 Testando Supabase Storage...\n');

  // 1. Listar buckets
  console.log('📦 Listando buckets existentes:');
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
  
  if (bucketsError) {
    console.error('❌ Erro ao listar buckets:', bucketsError);
    return;
  }

  console.log('Buckets encontrados:', buckets.map(b => b.name).join(', ') || 'Nenhum');
  
  const petImagesBucket = buckets.find(b => b.name === 'pet-images');
  
  if (!petImagesBucket) {
    console.log('\n⚠️  Bucket "pet-images" NÃO existe!');
    console.log('\n📝 Para criar o bucket, execute os seguintes passos:');
    console.log('1. Acesse: https://vmomuhwalrflusvfdrmc.supabase.co');
    console.log('2. Vá em Storage > New bucket');
    console.log('3. Nome: pet-images');
    console.log('4. Public bucket: ✅ Marcado');
    console.log('5. File size limit: 5MB');
    console.log('6. Allowed MIME types: image/jpeg,image/jpg,image/png,image/webp\n');
    
    // Tentar criar o bucket automaticamente
    console.log('🔧 Tentando criar o bucket automaticamente...');
    const { data: newBucket, error: createError } = await supabase.storage.createBucket('pet-images', {
      public: true,
      fileSizeLimit: 5242880, // 5MB em bytes
      allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    });

    if (createError) {
      console.error('❌ Erro ao criar bucket:', createError);
      console.log('\n⚠️  Você precisará criar o bucket manualmente no dashboard do Supabase.');
    } else {
      console.log('✅ Bucket criado com sucesso!');
      console.log('\n📋 Próximo passo: Configurar políticas de RLS');
      console.log('Execute o seguinte SQL no Supabase SQL Editor:\n');
      console.log(`-- Permitir upload para usuários autenticados
CREATE POLICY "Allow authenticated users to upload"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'pet-images');

-- Permitir leitura pública
CREATE POLICY "Allow public read access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'pet-images');

-- Permitir deleção pelos proprietários
CREATE POLICY "Allow users to delete their own uploads"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'pet-images' AND auth.uid()::text = owner);`);
    }
  } else {
    console.log('\n✅ Bucket "pet-images" existe!');
    console.log('Configurações:', {
      public: petImagesBucket.public,
      fileSizeLimit: petImagesBucket.file_size_limit,
      allowedMimeTypes: petImagesBucket.allowed_mime_types
    });

    // Testar upload
    console.log('\n📤 Testando upload de arquivo...');
    const testBuffer = Buffer.from('test image content');
    const testPath = 'test/test-image.jpg';
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('pet-images')
      .upload(testPath, testBuffer, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (uploadError) {
      console.error('❌ Erro no upload:', uploadError);
      console.log('\n⚠️  Verifique se as políticas de RLS estão configuradas corretamente.');
    } else {
      console.log('✅ Upload funcionando!');
      
      // Testar URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('pet-images')
        .getPublicUrl(testPath);
      
      console.log('📍 URL pública:', publicUrl);

      // Limpar arquivo de teste
      await supabase.storage.from('pet-images').remove([testPath]);
      console.log('🧹 Arquivo de teste removido');
    }
  }

  console.log('\n✅ Teste concluído!');
}

testStorage().catch(console.error);
