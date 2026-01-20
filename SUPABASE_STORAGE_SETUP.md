# 📦 Configuração do Supabase Storage para Upload de Imagens

## 🎯 O que foi implementado

### Backend (API):
- ✅ Módulo de Upload (`src/upload`)
- ✅ Endpoint `POST /api/upload/pet-image`
- ✅ Validação de tipo de arquivo (JPEG, PNG, WebP)
- ✅ Validação de tamanho (máximo 5MB)
- ✅ Upload direto para Supabase Storage
- ✅ Retorna URL pública da imagem

### Frontend:
- ✅ Componente de upload com drag-and-drop visual
- ✅ Preview das imagens
- ✅ Indicador de progresso
- ✅ Validação no cliente
- ✅ Múltiplos uploads simultâneos
- ✅ Limite de 5 fotos por pet

## 📋 Passos para Configuração

### 1. Instalar Dependências da API

```bash
cd /media/dados/Desenvolvimento/Faculdade/adota-pet/api
npm install @nestjs/platform-express multer uuid
npm install -D @types/multer @types/uuid
```

### 2. Criar Bucket no Supabase

Acesse: https://vmomuhwalrflusvfdrmc.supabase.co

**Passo a passo:**

1. No menu lateral, clique em **Storage**
2. Clique em **New bucket**
3. Preencha:
   - **Name**: `pet-images`
   - **Public bucket**: ✅ Marcado (para URLs públicas)
   - **File size limit**: 5 MB
   - **Allowed MIME types**: `image/jpeg,image/jpg,image/png,image/webp`
4. Clique em **Create bucket**

### 3. Configurar Políticas de Acesso (RLS)

No Supabase, vá em **Storage > Policies** e adicione as seguintes políticas para o bucket `pet-images`:

#### Política 1: Permitir Upload (Autenticados)

```sql
-- Nome: Allow authenticated users to upload
-- Operação: INSERT
-- Policy definition:
CREATE POLICY "Allow authenticated users to upload"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'pet-images');
```

#### Política 2: Permitir Leitura Pública

```sql
-- Nome: Allow public read access
-- Operação: SELECT
-- Policy definition:
CREATE POLICY "Allow public read access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'pet-images');
```

#### Política 3: Permitir Deletar (ONGs proprietárias)

```sql
-- Nome: Allow users to delete their own uploads
-- Operação: DELETE
-- Policy definition:
CREATE POLICY "Allow users to delete their own uploads"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'pet-images' AND auth.uid()::text = owner);
```

### 4. Reiniciar a API

```bash
cd /media/dados/Desenvolvimento/Faculdade/adota-pet/api
npm run start:dev
```

A API agora terá o endpoint `/api/upload/pet-image` disponível!

## 🧪 Como Testar

### 1. Via Swagger (http://localhost:3000/api/docs)

1. Faça login e copie o token
2. Clique em **Authorize** e cole o token
3. Vá em **Upload > POST /upload/pet-image**
4. Clique em **Try it out**
5. Clique em **Choose File** e selecione uma imagem
6. Clique em **Execute**
7. A resposta deve conter a URL pública da imagem

### 2. Via Frontend

1. Faça login como ONG
2. Vá para Dashboard > **Adicionar Pet**
3. Preencha os dados do pet
4. Na seção **Fotos do Pet**, clique na área de upload
5. Selecione até 5 imagens (JPG, PNG ou WebP)
6. As imagens serão enviadas automaticamente
7. Você verá o preview de cada imagem
8. Clique em **Cadastrar Pet**

## 📊 Estrutura de Armazenamento

As imagens serão salvas no seguinte padrão:

```
pet-images/
  └── pets/
      ├── a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg
      ├── b2c3d4e5-f6a7-8901-bcde-f12345678901.png
      └── c3d4e5f6-a7b8-9012-cdef-123456789012.webp
```

- Nome único gerado com UUID v4
- Extensão original do arquivo preservada
- Organização por pasta `pets/`

## 🔒 Segurança

### Validações Implementadas:

**Backend:**
- ✅ Tipo de arquivo (apenas imagens)
- ✅ Tamanho máximo: 5MB
- ✅ Autenticação obrigatória (JWT)
- ✅ Nome de arquivo único (UUID)

**Frontend:**
- ✅ Validação de tipo antes do upload
- ✅ Validação de tamanho antes do upload
- ✅ Limite de 5 fotos por pet
- ✅ Feedback visual de erros

## 📝 Exemplo de Resposta da API

```json
{
  "url": "https://vmomuhwalrflusvfdrmc.supabase.co/storage/v1/object/public/pet-images/pets/a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg",
  "filename": "thor.jpg",
  "size": 1048576,
  "mimetype": "image/jpeg"
}
```

## 🐛 Troubleshooting

### Erro: "Bucket not found"
**Solução**: Verifique se criou o bucket `pet-images` no Supabase Storage

### Erro: "Policy violation"
**Solução**: Configure as políticas RLS conforme instruções acima

### Erro: "File too large"
**Solução**: Imagem maior que 5MB. Redimensione ou comprima a imagem

### Erro: "Invalid file type"
**Solução**: Use apenas JPG, PNG ou WebP

### Upload muito lento
**Solução**: Verifique sua conexão com internet. O Supabase usa CDN global.

## 🚀 Melhorias Futuras (Opcional)

- [ ] Redimensionamento automático de imagens no backend
- [ ] Compressão de imagens antes do upload
- [ ] Upload com drag-and-drop
- [ ] Cropping de imagens
- [ ] Watermark automático
- [ ] Otimização de imagens com Sharp
- [ ] Cache de imagens com CDN

## 📚 Referências

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [NestJS File Upload](https://docs.nestjs.com/techniques/file-upload)
- [Multer Documentation](https://github.com/expressjs/multer)
