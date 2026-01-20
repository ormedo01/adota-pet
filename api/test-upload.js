const { createClient } = require('@supabase/supabase-js');
require('dotenv/config');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function testUpload() {
  console.log('📤 Testando upload...\n');

  const testBuffer = Buffer.from('test image content');
  const testPath = 'test/test-upload.jpg';

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('pet-images')
    .upload(testPath, testBuffer, {
      contentType: 'image/jpeg',
      upsert: true
    });

  if (uploadError) {
    console.error('❌ Erro no upload:', uploadError);
    return;
  }

  console.log('✅ Upload bem-sucedido!');
  console.log('Dados:', uploadData);

  // Obter URL pública
  const { data: { publicUrl } } = supabase.storage
    .from('pet-images')
    .getPublicUrl(testPath);

  console.log('\n📍 URL pública:', publicUrl);

  // Limpar arquivo de teste
  const { error: deleteError } = await supabase.storage
    .from('pet-images')
    .remove([testPath]);

  if (deleteError) {
    console.error('⚠️  Erro ao deletar:', deleteError);
  } else {
    console.log('\n🧹 Arquivo de teste removido');
  }

  console.log('\n✅ Upload está funcionando corretamente!');
  console.log('\n📋 Próximo passo: Configure as políticas RLS no Supabase Dashboard:');
  console.log('   1. Acesse: https://vmomuhwalrflusvfdrmc.supabase.co/project/_/storage/policies');
  console.log('   2. Selecione o bucket "pet-images"');
  console.log('   3. Adicione as políticas conforme o arquivo storage-policies.sql');
}

testUpload().catch(console.error);
