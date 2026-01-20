# 🐾 Adota Pet - Documentação Completa

Sistema completo de adoção de animais com frontend React e API NestJS.

## 📚 Índice da Documentação

### 📖 Guias Principais
1. **[API_SUMMARY.md](API_SUMMARY.md)** ⭐ COMECE AQUI!
   - Resumo executivo de tudo que foi implementado
   - Visão geral da arquitetura
   - Roadmap e próximos passos

2. **[API_INTEGRATION_GUIDE.md](API_INTEGRATION_GUIDE.md)** 🔗
   - Passo a passo para integrar frontend com API
   - Exemplos de código
   - Guia de troubleshooting

### 🗄️ Banco de Dados
3. **[api/database/README.md](api/database/README.md)**
   - Setup do Supabase
   - Estrutura do banco
   - Políticas de segurança

4. **[api/database/schema.sql](api/database/schema.sql)**
   - Schema completo do PostgreSQL
   - Tabelas, views, triggers
   - Comentários e documentação

5. **[api/database/seed.sql](api/database/seed.sql)**
   - Dados de exemplo para testes
   - ONGs, pets e candidaturas de exemplo

### 🚀 API
6. **[api/README.md](api/README.md)**
   - Documentação completa da API
   - Todos os endpoints
   - Exemplos de uso

7. **[api/COMMANDS.md](api/COMMANDS.md)**
   - Comandos úteis
   - Scripts de teste
   - Queries SQL

### 📱 Frontend
8. **[ADOPTION_SYSTEM_GUIDE.md](ADOPTION_SYSTEM_GUIDE.md)**
   - Sistema de candidaturas (4 etapas)
   - Fluxo completo de adoção

9. **[AUTHENTICATION_GUIDE.md](AUTHENTICATION_GUIDE.md)**
   - Sistema de login e proteção de rotas
   - ONGs vs Adotantes

10. **[REACT_NATIVE_APP.md](REACT_NATIVE_APP.md)**
    - Informações sobre app mobile

## 🎯 Quick Start

### 1. Configurar Banco de Dados (10 min)
```bash
# 1. Crie conta no Supabase (https://supabase.com)
# 2. Crie novo projeto
# 3. Execute api/database/schema.sql no SQL Editor
# 4. Execute api/database/seed.sql (opcional - dados de teste)
# 5. Copie credenciais (Settings > API)
```

### 2. Iniciar API (5 min)
```bash
cd api
cp .env.example .env
# Edite .env com credenciais do Supabase
npm install
npm run start:dev
```

### 3. Iniciar Frontend (3 min)
```bash
cd ..  # volta para raiz
npm install
npm run dev
```

### 4. Testar (2 min)
```bash
# Login com ONG de teste:
Email: contato@patinhasfelizes.org
Senha: senha123

# Ou crie nova conta em /register
```

## 🏗️ Estrutura do Projeto

```
adota-pet/
├── 📄 Documentação
│   ├── API_SUMMARY.md              ⭐ LEIA PRIMEIRO
│   ├── API_INTEGRATION_GUIDE.md    🔗 Integração
│   ├── ADOPTION_SYSTEM_GUIDE.md    
│   ├── AUTHENTICATION_GUIDE.md
│   └── REACT_NATIVE_APP.md
│
├── 🎨 Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   └── lib/
│   ├── package.json
│   └── vite.config.ts
│
└── 🚀 API (NestJS + Supabase)
    ├── database/
    │   ├── schema.sql              📊 Schema do banco
    │   ├── seed.sql                🌱 Dados de exemplo
    │   └── README.md
    ├── src/
    │   ├── auth/                   🔐 Autenticação JWT
    │   ├── users/                  👤 Usuários
    │   ├── pets/                   🐶 Pets
    │   ├── applications/           📋 Candidaturas
    │   ├── favorites/              ⭐ Favoritos
    │   └── supabase/               💾 Cliente Supabase
    ├── README.md
    ├── COMMANDS.md                 🛠️ Comandos úteis
    └── package.json
```

## 📊 Stack Tecnológica

### Frontend
- React 18 + TypeScript
- Vite (Build tool)
- TailwindCSS + Shadcn/ui
- React Router
- Axios

### Backend
- NestJS 10
- TypeScript
- Passport + JWT
- Class Validator
- Supabase Client

### Database & Infrastructure
- PostgreSQL (via Supabase)
- Supabase Auth
- Supabase Storage
- Row Level Security (RLS)

## 🎓 Endpoints Principais

### Autenticação
- `POST /api/auth/register` - Cadastro
- `POST /api/auth/login` - Login

### Pets
- `GET /api/pets` - Listar (público)
- `POST /api/pets` - Cadastrar (ONG)
- `GET /api/pets/:id` - Detalhes

### Candidaturas
- `POST /api/applications` - Criar (Adotante)
- `GET /api/applications` - Listar minhas
- `PATCH /api/applications/:id/status` - Atualizar (ONG)

### Favoritos
- `GET /api/favorites` - Meus favoritos
- `POST /api/favorites/:petId` - Adicionar
- `DELETE /api/favorites/:petId` - Remover

Ver documentação completa em [api/README.md](api/README.md)

## 🔐 Credenciais de Teste

### ONG Padrão:
- **Email:** contato@patinhasfelizes.org
- **Senha:** senha123
- **Tipo:** ONG

### Criar Novas Contas:
Acesse `/register` no frontend ou use o endpoint `POST /api/auth/register`

## 💰 Custos (Supabase)

### Plano Free (Recomendado para MVP)
- ✅ 500MB Database
- ✅ 1GB Storage
- ✅ 50.000 Monthly Active Users
- ✅ **Custo: $0/mês**

### Plano Pro (Para escalar)
- 8GB Database
- 100GB Storage
- 100.000 MAU
- **Custo: $25/mês**

## 📝 Próximos Passos

1. ✅ Configurar Supabase
2. ✅ Iniciar API
3. ⏳ Integrar frontend com API
4. ⏳ Adicionar upload de imagens
5. ⏳ Implementar sistema de mensagens
6. ⏳ Deploy (Vercel + Railway)

## 🤝 Contribuindo

Este é um projeto acadêmico, mas sugestões são bem-vindas!

## 📄 Licença

MIT

---

**Desenvolvido com ❤️ para ajudar pets a encontrarem lares amorosos 🐾**
