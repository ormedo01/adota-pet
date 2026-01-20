# 🐾 Adota Pet - API

API RESTful para o sistema de adoção de pets, desenvolvida com NestJS e Supabase.

## 🚀 Tecnologias

- **NestJS** - Framework Node.js
- **Supabase** - PostgreSQL + Auth + Storage
- **TypeScript** - Linguagem
- **JWT** - Autenticação
- **Passport** - Estratégias de autenticação
- **Class Validator** - Validação de dados

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Supabase (gratuito)

## ⚙️ Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Vá em **SQL Editor** e execute o script `database/schema.sql`
3. Copie as credenciais em **Settings** > **API**

### 3. Configurar variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_KEY=sua-service-role-key
JWT_SECRET=sua-chave-secreta-jwt
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:8080
```

### 4. Iniciar servidor

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

A API estará rodando em `http://localhost:3000/api`

## 📚 Documentação dos Endpoints

### 🔐 Autenticação

#### POST `/api/auth/register`
Registrar novo usuário (ONG ou Adotante)

**Body:**
```json
{
  "email": "usuario@email.com",
  "password": "senha123",
  "name": "Nome do Usuário",
  "user_type": "adopter", // ou "ong"
  "phone": "(11) 99999-9999",
  
  // Para adotantes:
  "cpf": "123.456.789-00",
  "birth_date": "1990-01-01",
  
  // Para ONGs:
  "cnpj": "12.345.678/0001-90",
  "description": "Descrição da ONG",
  "city": "São Paulo",
  "state": "SP"
}
```

#### POST `/api/auth/login`
Fazer login

---

### 👤 Usuários

Todos os endpoints requerem autenticação (Header: `Authorization: Bearer <token>`)

- GET `/api/users/me` - Perfil do usuário
- PATCH `/api/users/me` - Atualizar perfil
- GET `/api/users/ongs` - Listar ONGs
- GET `/api/users/ong/:id/statistics` - Estatísticas da ONG

---

### 🐶 Pets

- GET `/api/pets` - Listar pets (público)
- GET `/api/pets/:id` - Detalhes do pet
- POST `/api/pets` 🔒 ONG - Cadastrar pet
- PATCH `/api/pets/:id` 🔒 ONG - Atualizar pet
- DELETE `/api/pets/:id` 🔒 ONG - Remover pet
- GET `/api/pets/my-pets` 🔒 ONG - Meus pets
- PATCH `/api/pets/:id/status` 🔒 ONG - Atualizar status

---

### 📋 Candidaturas

- POST `/api/applications` 🔒 Adotante - Criar candidatura
- GET `/api/applications` - Listar candidaturas
- GET `/api/applications/:id` - Detalhes
- PATCH `/api/applications/:id/status` 🔒 ONG - Atualizar status
- DELETE `/api/applications/:id` 🔒 Adotante - Cancelar
- GET `/api/applications/pet/:petId/stats` 🔒 ONG - Estatísticas

---

### ⭐ Favoritos (Adotantes)

- GET `/api/favorites` - Listar favoritos
- POST `/api/favorites/:petId` - Adicionar favorito
- DELETE `/api/favorites/:petId` - Remover favorito
- GET `/api/favorites/check/:petId` - Verificar se é favorito
- GET `/api/favorites/ids` - IDs dos favoritos

---

## 🗄️ Estrutura do Banco

Ver detalhes em [`database/README.md`](database/README.md)

**Tabelas:** users, pets, adoption_applications, favorites, messages

**Views:** ong_statistics, pets_with_ong, applications_detailed

## 🔒 Autenticação

A API usa JWT. Adicione o token no header:

```
Authorization: Bearer <seu-token>
```

## 📂 Estrutura do Projeto

```
api/
├── database/
│   ├── schema.sql
│   └── README.md
├── src/
│   ├── auth/
│   ├── users/
│   ├── pets/
│   ├── applications/
│   ├── favorites/
│   ├── supabase/
│   └── main.ts
└── README.md
```

## 🧪 Testando

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"contato@patinhasfelizes.org","password":"senha123","user_type":"ong"}'

# Listar pets
curl http://localhost:3000/api/pets
```

## 📝 Credencial de Teste

**ONG:**
- Email: `contato@patinhasfelizes.org`
- Senha: `senha123`

## 📄 Licença

MIT
