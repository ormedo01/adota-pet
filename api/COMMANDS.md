# 🛠️ Comandos Úteis - Adota Pet API

## 📦 NPM Scripts

```bash
# Desenvolvimento (auto-reload)
npm run start:dev

# Produção
npm run build
npm run start:prod

# Modo debug
npm run start:debug

# Lint
npm run lint

# Format
npm run format

# Testes
npm run test
npm run test:watch
npm run test:cov
npm run test:e2e
```

## 🗄️ Supabase CLI

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Link projeto
supabase link --project-ref seu-projeto-id

# Ver status
supabase status

# Ver logs
supabase logs

# Backup
supabase db dump -f backup.sql

# Restore
supabase db reset
```

## 🧪 Testes com cURL

### Autenticação

```bash
# Registrar ONG
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@ong.org",
    "password": "senha123",
    "name": "ONG Teste",
    "user_type": "ong",
    "cnpj": "12.345.678/0001-99",
    "city": "São Paulo",
    "state": "SP"
  }'

# Registrar Adotante
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@adotante.com",
    "password": "senha123",
    "name": "Adotante Teste",
    "user_type": "adopter",
    "cpf": "123.456.789-99",
    "birth_date": "1990-01-01"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "contato@patinhasfelizes.org",
    "password": "senha123",
    "user_type": "ong"
  }' | jq

# Salvar token
export TOKEN="seu-token-aqui"
```

### Pets

```bash
# Listar todos os pets
curl http://localhost:3000/api/pets | jq

# Buscar por espécie
curl "http://localhost:3000/api/pets?species=dog" | jq

# Buscar por tamanho
curl "http://localhost:3000/api/pets?size=large" | jq

# Busca combinada
curl "http://localhost:3000/api/pets?species=cat&size=small&city=São Paulo" | jq

# Ver detalhes de um pet
curl http://localhost:3000/api/pets/UUID-DO-PET | jq

# Criar pet (ONG)
curl -X POST http://localhost:3000/api/pets \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pipoca",
    "species": "cat",
    "breed": "Vira-lata",
    "age_months": 6,
    "size": "small",
    "gender": "female",
    "description": "Gatinha linda e carinhosa",
    "good_with_kids": true,
    "good_with_pets": true
  }' | jq

# Atualizar pet
curl -X PATCH http://localhost:3000/api/pets/UUID-DO-PET \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Descrição atualizada"
  }' | jq

# Atualizar status
curl -X PATCH http://localhost:3000/api/pets/UUID-DO-PET/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "adopted"
  }' | jq

# Meus pets (ONG)
curl http://localhost:3000/api/pets/my-pets \
  -H "Authorization: Bearer $TOKEN" | jq

# Deletar pet
curl -X DELETE http://localhost:3000/api/pets/UUID-DO-PET \
  -H "Authorization: Bearer $TOKEN"
```

### Candidaturas

```bash
# Criar candidatura (Adotante)
curl -X POST http://localhost:3000/api/applications \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pet_id": "UUID-DO-PET",
    "full_name": "João Silva",
    "email": "joao@email.com",
    "phone": "(11) 99999-9999",
    "cpf": "123.456.789-00",
    "birth_date": "1990-01-01",
    "address": "Rua ABC, 123",
    "city": "São Paulo",
    "state": "SP",
    "zip_code": "12345-678",
    "housing_type": "house",
    "housing_ownership": "own",
    "has_yard": true,
    "yard_fenced": true,
    "household_size": 3,
    "has_children": false,
    "all_agree": true,
    "has_current_pets": false,
    "daily_hours_alone": "4-6 horas",
    "who_cares_when_away": "Vizinho",
    "financial_readiness": "ready",
    "monthly_budget": 300,
    "adoption_reason": "Quero um companheiro",
    "what_if_moving": "Levaria comigo",
    "long_term_commitment": true,
    "accepts_follow_up_visits": true
  }' | jq

# Listar minhas candidaturas
curl http://localhost:3000/api/applications \
  -H "Authorization: Bearer $TOKEN" | jq

# Ver detalhes de candidatura
curl http://localhost:3000/api/applications/UUID-DA-CANDIDATURA \
  -H "Authorization: Bearer $TOKEN" | jq

# Atualizar status (ONG)
curl -X PATCH http://localhost:3000/api/applications/UUID-DA-CANDIDATURA/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "approved",
    "notes": "Candidatura aprovada! Entre em contato."
  }' | jq

# Rejeitar candidatura (ONG)
curl -X PATCH http://localhost:3000/api/applications/UUID-DA-CANDIDATURA/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "rejected",
    "rejection_reason": "Perfil não compatível com as necessidades do pet."
  }' | jq

# Cancelar candidatura (Adotante)
curl -X DELETE http://localhost:3000/api/applications/UUID-DA-CANDIDATURA \
  -H "Authorization: Bearer $TOKEN"

# Estatísticas por pet (ONG)
curl http://localhost:3000/api/applications/pet/UUID-DO-PET/stats \
  -H "Authorization: Bearer $TOKEN" | jq
```

### Favoritos

```bash
# Listar favoritos
curl http://localhost:3000/api/favorites \
  -H "Authorization: Bearer $TOKEN" | jq

# Adicionar favorito
curl -X POST http://localhost:3000/api/favorites/UUID-DO-PET \
  -H "Authorization: Bearer $TOKEN" | jq

# Remover favorito
curl -X DELETE http://localhost:3000/api/favorites/UUID-DO-PET \
  -H "Authorization: Bearer $TOKEN"

# Verificar se é favorito
curl http://localhost:3000/api/favorites/check/UUID-DO-PET \
  -H "Authorization: Bearer $TOKEN" | jq

# Lista de IDs favoritos
curl http://localhost:3000/api/favorites/ids \
  -H "Authorization: Bearer $TOKEN" | jq
```

### Usuários

```bash
# Meu perfil
curl http://localhost:3000/api/users/me \
  -H "Authorization: Bearer $TOKEN" | jq

# Atualizar perfil
curl -X PATCH http://localhost:3000/api/users/me \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "(11) 98888-7777",
    "description": "Descrição atualizada"
  }' | jq

# Listar ONGs
curl http://localhost:3000/api/users/ongs | jq

# Estatísticas da ONG
curl http://localhost:3000/api/users/ong/UUID-DA-ONG/statistics \
  -H "Authorization: Bearer $TOKEN" | jq
```

## 🗄️ Queries SQL Úteis

```sql
-- Ver todas as candidaturas com detalhes
SELECT * FROM applications_detailed 
ORDER BY submitted_at DESC;

-- Estatísticas de uma ONG específica
SELECT * FROM ong_statistics 
WHERE ong_id = 'UUID-DA-ONG';

-- Pets mais populares (mais candidaturas)
SELECT 
  p.name,
  COUNT(aa.id) as total_applications
FROM pets p
LEFT JOIN adoption_applications aa ON aa.pet_id = p.id
GROUP BY p.id, p.name
ORDER BY total_applications DESC
LIMIT 10;

-- Taxa de aprovação por ONG
SELECT 
  u.name as ong_name,
  COUNT(CASE WHEN aa.status = 'approved' THEN 1 END) as approved,
  COUNT(CASE WHEN aa.status = 'rejected' THEN 1 END) as rejected,
  ROUND(
    COUNT(CASE WHEN aa.status = 'approved' THEN 1 END)::numeric / 
    NULLIF(COUNT(aa.id), 0) * 100, 
    2
  ) as approval_rate
FROM users u
JOIN pets p ON p.ong_id = u.id
LEFT JOIN adoption_applications aa ON aa.pet_id = p.id
WHERE u.user_type = 'ong'
GROUP BY u.id, u.name;

-- Pets adotados por período
SELECT 
  DATE(updated_at) as date,
  COUNT(*) as adopted_count
FROM pets
WHERE status = 'adopted'
  AND updated_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(updated_at)
ORDER BY date DESC;
```

## 🐛 Debug

```bash
# Ver logs da API
npm run start:dev 2>&1 | tee api.log

# Ver processos Node
ps aux | grep node

# Matar processo na porta 3000
lsof -ti:3000 | xargs kill

# Ver uso de memória
node --inspect index.js

# Limpar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install
```

## 📊 Monitoramento

```bash
# Ver tamanho do banco
SELECT pg_size_pretty(pg_database_size('postgres'));

# Tabelas maiores
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

# Queries lentas (Supabase Dashboard > Database > Logs)
```

## 🚀 Deploy

```bash
# Build para produção
npm run build

# Rodar build
npm run start:prod

# Deploy no Railway
railway login
railway init
railway up

# Deploy no Render
# 1. Conecte seu repo
# 2. Configure variáveis de ambiente
# 3. Deploy automático
```

## 🔧 Troubleshooting

```bash
# Verificar variáveis de ambiente
echo $SUPABASE_URL
echo $JWT_SECRET

# Testar conexão com Supabase
curl $SUPABASE_URL/rest/v1/ \
  -H "apikey: $SUPABASE_ANON_KEY"

# Verificar se API está rodando
curl http://localhost:3000/api/pets

# Ver logs do Docker (se usar)
docker logs -f container-name
```
