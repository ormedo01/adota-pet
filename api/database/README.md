# Configuração do Banco de Dados

## 🎯 Supabase Setup

### 1. Criar Projeto no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Clique em "New Project"
4. Preencha:
   - **Project name**: adota-pet
   - **Database Password**: (escolha uma senha forte)
   - **Region**: South America (São Paulo) - mais próximo do Brasil
   - **Pricing Plan**: Free (perfeito para MVP)
5. Aguarde a criação (1-2 minutos)

### 2. Executar Schema SQL
1. No dashboard do Supabase, vá em **SQL Editor**
2. Clique em **New Query**
3. Cole todo o conteúdo do arquivo `schema.sql`
4. Clique em **Run** (ou Ctrl/Cmd + Enter)
5. Verifique se todas as tabelas foram criadas em **Table Editor**

### 3. Obter Credenciais
1. Vá em **Settings** > **API**
2. Copie as seguintes informações:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: (chave pública)
   - **service_role key**: (chave privada - NUNCA commitar!)

### 4. Configurar Variáveis de Ambiente
Crie o arquivo `.env` na pasta `api/`:

```env
# Supabase Configuration
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-anon-key-aqui
SUPABASE_SERVICE_KEY=sua-service-role-key-aqui

# JWT Configuration (use o mesmo JWT Secret do Supabase)
JWT_SECRET=seu-jwt-secret-do-supabase
JWT_EXPIRES_IN=7d

# Application
PORT=3000
NODE_ENV=development

# Frontend URL (para CORS)
FRONTEND_URL=http://localhost:8080
```

⚠️ **IMPORTANTE**: Adicione `.env` no `.gitignore`!

### 5. Configurar Storage para Imagens
1. No Supabase Dashboard, vá em **Storage**
2. Clique em **Create a new bucket**
3. Nome: `pet-images`
4. **Public bucket**: ✅ Sim (para as imagens serem acessíveis)
5. Configure políticas de upload:
   - Apenas usuários tipo 'ong' podem fazer upload
   - Todos podem ler (GET)

### 6. Configurar Authentication (Opcional)
Se quiser usar o Supabase Auth ao invés de JWT próprio:
1. Vá em **Authentication** > **Providers**
2. Habilite **Email**
3. Configure templates de email
4. Adicione URL de redirecionamento: `http://localhost:8080`

## 📊 Estrutura do Banco

### Tabelas Criadas:
- ✅ `users` - ONGs e Adotantes
- ✅ `pets` - Animais para adoção
- ✅ `adoption_applications` - Candidaturas (formulário 4 etapas)
- ✅ `favorites` - Pets favoritados
- ✅ `messages` - Mensagens entre ONG e Adotante

### Views Criadas:
- ✅ `ong_statistics` - Estatísticas das ONGs
- ✅ `pets_with_ong` - Pets com info da ONG
- ✅ `applications_detailed` - Candidaturas detalhadas

### Triggers Automáticos:
- ✅ `updated_at` - Atualiza automaticamente
- ✅ Status do pet quando aprovado
- ✅ Validações de integridade

## 🔐 Segurança

### Row Level Security (RLS)
Políticas configuradas:
- Adotantes só veem suas próprias candidaturas
- ONGs só veem pets e candidaturas próprias
- Pets públicos para listagem
- Favoritos privados por usuário

## 📝 Credenciais Padrão

**ONG de Teste:**
- Email: `contato@patinhasfelizes.org`
- Senha: `senha123`
- Tipo: ONG

## 🚀 Próximos Passos

1. ✅ Schema criado
2. ⏳ Configurar conexão no NestJS
3. ⏳ Implementar endpoints
4. ⏳ Testar com Insomnia/Postman
5. ⏳ Integrar frontend
