# 🚀 Como Testar o Login

## ✅ Status Atual

- **API**: ✅ Rodando em http://localhost:3000/api (PID: 70224)
- **Campo access_token**: ✅ Corrigido
- **Axios**: ✅ Instalado no frontend
- **Integração**: ✅ Completa

## ⚠️ IMPORTANTE: Atualizar Senhas no Banco

Antes de testar o login no frontend, você PRECISA atualizar as senhas no Supabase:

### 1. Acesse o Supabase SQL Editor
https://vmomuhwalrflusvfdrmc.supabase.co

### 2. Execute este SQL:

```sql
-- Atualizar senha da ONG Patinhas Felizes
UPDATE users 
SET password_hash = '$2b$10$HlHCjlFtl7D.vtZyep/0z.qjV89959o/frAOlfJqPgtU70bqPuYPW'
WHERE email = 'contato@patinhasfelizes.org';

-- Atualizar senha das outras ONGs
UPDATE users 
SET password_hash = '$2b$10$HlHCjlFtl7D.vtZyep/0z.qjV89959o/frAOlfJqPgtU70bqPuYPW'
WHERE email IN ('amigosanimais@ong.org', 'anjosdequatropatas@ong.org');

-- Atualizar senha dos adotantes
UPDATE users 
SET password_hash = '$2b$10$HlHCjlFtl7D.vtZyep/0z.qjV89959o/frAOlfJqPgtU70bqPuYPW'
WHERE email IN ('joao.silva@email.com', 'maria.santos@email.com');

-- Verificar
SELECT email, name, user_type, 
       CASE 
         WHEN password_hash = '$2b$10$HlHCjlFtl7D.vtZyep/0z.qjV89959o/frAOlfJqPgtU70bqPuYPW' 
         THEN '✅ Hash correto' 
         ELSE '❌ Hash incorreto' 
       END as status_hash
FROM users
ORDER BY created_at;
```

### 3. Inicie o Frontend

```bash
cd /media/dados/Desenvolvimento/Faculdade/adota-pet
npm run dev
```

### 4. Teste o Login

Acesse: http://localhost:8080/login (ou a porta que o Vite mostrar)

**Credenciais de Teste (ONG):**
- Email: `contato@patinhasfelizes.org`
- Senha: `senha123`
- Tipo: **ONG**

**Credenciais de Teste (Adotante):**
- Email: `joao.silva@email.com`
- Senha: `senha123`
- Tipo: **Adotante**

## 🔍 Verificar Status da API

```bash
# Ver logs da API
tail -f /tmp/api.log

# Verificar se está rodando
ps aux | grep "nest start"

# Testar endpoint manualmente
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"contato@patinhasfelizes.org","password":"senha123","user_type":"ong"}'
```

## 🐛 Se Continuar com Erro

### Erro: ERR_CONNECTION_REFUSED

A API não está rodando. Reinicie:

```bash
pkill -f "nest start"
cd /media/dados/Desenvolvimento/Faculdade/adota-pet/api
nohup npm run start:dev > /tmp/api.log 2>&1 &
```

### Erro: 401 Unauthorized

As senhas no banco não foram atualizadas. Execute o SQL acima no Supabase.

### Erro: Network Error no Frontend

1. Verifique se a API está rodando: `curl http://localhost:3000/api/auth/login`
2. Verifique o arquivo `.env` na raiz do projeto frontend
3. Reinicie o frontend: `npm run dev`

## ✨ Próximos Passos Após Login Funcionar

1. **Testar Registro** - Criar nova conta de ONG e Adotante
2. **Dashboard** - Ver dados do usuário logado
3. **Pets** - Integrar listagem de pets
4. **Favoritos** - Implementar sistema de favoritos
5. **Candidaturas** - Formulário de adoção

---

**Log da API**: `/tmp/api.log`  
**PID da API**: Procure com `ps aux | grep "nest start"`
