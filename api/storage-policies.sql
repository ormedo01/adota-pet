-- Configuração de políticas RLS para o bucket pet-images

-- Habilitar RLS no bucket (se ainda não estiver)
-- O Supabase Storage já tem RLS habilitado por padrão

-- 1. Permitir upload para usuários autenticados
CREATE POLICY IF NOT EXISTS "Allow authenticated users to upload"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'pet-images');

-- 2. Permitir leitura pública (para que as imagens sejam acessíveis sem autenticação)
CREATE POLICY IF NOT EXISTS "Allow public read access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'pet-images');

-- 3. Permitir atualização para usuários autenticados
CREATE POLICY IF NOT EXISTS "Allow authenticated users to update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'pet-images');

-- 4. Permitir deleção para usuários autenticados
CREATE POLICY IF NOT EXISTS "Allow authenticated users to delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'pet-images');
