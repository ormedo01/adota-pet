# 🚀 Guia de Deploy na Vercel - Adota Pet

Este guia te ajudará a fazer o deploy do frontend (React + Vite) e da API (NestJS) na Vercel usando o plano gratuito.

## 📋 Pré-requisitos

1. **Conta na Vercel**: Crie uma conta gratuita em [vercel.com](https://vercel.com)
2. **Vercel CLI** (opcional, mas recomendado):
   ```bash
   npm install -g vercel
   ```
3. **Repositório Git**: Certifique-se de que seu código está em um repositório Git (GitHub, GitLab ou Bitbucket)

## 🎯 Estratégia de Deploy

Você precisará criar **2 projetos separados** na Vercel:
1. **Frontend** (React + Vite) - raiz do projeto
2. **API** (NestJS) - pasta `/api`

---

## 🌐 Parte 1: Deploy do Frontend

### Passo 1: Preparar o Frontend

1. **Build local para testar**:
   ```bash
   npm run build
   ```
   
   Se houver erros, corrija-os antes de continuar.

### Passo 2: Deploy via Vercel Dashboard

1. Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
2. Clique em **"Add New..."** → **"Project"**
3. Importe seu repositório
4. Configure o projeto:
   - **Project Name**: `adota-pet-frontend` (ou o nome que preferir)
   - **Framework Preset**: Vite
   - **Root Directory**: `.` (raiz)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Configure as variáveis de ambiente**:
   - Clique em **"Environment Variables"**
   - Adicione:
     ```
     Nome: VITE_API_URL
     Valor: https://adota-pet-api.vercel.app/api
     ```
     ⚠️ **IMPORTANTE**: Você precisará substituir a URL pela URL real da API depois do deploy da API (Parte 2)

6. Clique em **"Deploy"**

7. Aguarde o build completar. A URL do frontend será algo como:
   ```
   https://adota-pet-frontend.vercel.app
   ```

### Passo 3: (Opcional) Deploy via CLI

Se preferir usar a CLI:

```bash
# Na raiz do projeto
vercel

# Siga os prompts:
# - Set up and deploy? Yes
# - Which scope? Sua conta
# - Link to existing project? No
# - Project name? adota-pet-frontend
# - Directory? ./
# - Override settings? No
```

Para adicionar variáveis de ambiente:
```bash
vercel env add VITE_API_URL production
# Cole a URL da API quando solicitado
```

---

## 🔧 Parte 2: Deploy da API (NestJS)

### Passo 1: Preparar a API

1. **Build local para testar**:
   ```bash
   cd api
   npm run build
   ```

2. **Verificar se o dist foi criado**:
   ```bash
   ls -la dist/
   # Deve mostrar main.js e outros arquivos compilados
   ```

### Passo 2: Deploy via Vercel Dashboard

1. Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
2. Clique em **"Add New..."** → **"Project"**
3. Importe o **mesmo repositório**
4. Configure o projeto:
   - **Project Name**: `adota-pet-api`
   - **Framework Preset**: Other
   - **Root Directory**: `api` ⚠️ **IMPORTANTE: Selecionar a pasta api**
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Configure as variáveis de ambiente**:
   
   Clique em **"Environment Variables"** e adicione todas estas variáveis:
   
   ```
   SUPABASE_URL
   Valor: https://vmomuhwalrflusvfdrmc.supabase.co
   
   SUPABASE_ANON_KEY
   Valor: (copie do seu arquivo .env.example)
   
   SUPABASE_SERVICE_KEY
   Valor: (copie do seu arquivo .env.example)
   
   JWT_SECRET
   Valor: (copie do seu arquivo .env.example ou gere um novo)
   
   JWT_EXPIRES_IN
   Valor: 7d
   
   NODE_ENV
   Valor: production
   
   FRONTEND_URL
   Valor: https://adota-pet-frontend.vercel.app
   ```
   
   ⚠️ **IMPORTANTE**: Substitua a `FRONTEND_URL` pela URL real do frontend que você obteve na Parte 1

6. Clique em **"Deploy"**

7. Aguarde o build completar. A URL da API será algo como:
   ```
   https://adota-pet-api.vercel.app
   ```

### Passo 3: (Opcional) Deploy da API via CLI

```bash
cd api
vercel

# Siga os prompts:
# - Set up and deploy? Yes
# - Which scope? Sua conta
# - Link to existing project? No
# - Project name? adota-pet-api
# - Directory? ./
# - Override settings? No
```

Adicione todas as variáveis de ambiente:
```bash
vercel env add SUPABASE_URL production
vercel env add SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_KEY production
vercel env add JWT_SECRET production
vercel env add JWT_EXPIRES_IN production
vercel env add NODE_ENV production
vercel env add FRONTEND_URL production
```

---

## 🔄 Parte 3: Atualizar URLs Cruzadas

Agora que ambos os projetos estão no ar, você precisa atualizar as URLs:

### 1. Atualizar Frontend (VITE_API_URL)

1. Acesse o projeto do **frontend** no [dashboard da Vercel](https://vercel.com/dashboard)
2. Vá em **Settings** → **Environment Variables**
3. Edite `VITE_API_URL` e coloque a URL completa da API:
   ```
   https://adota-pet-api.vercel.app/api
   ```
4. **Importante**: Clique em **"Redeploy"** para aplicar as mudanças
   - Vá em **"Deployments"** → Clique nos 3 pontos do último deployment → **"Redeploy"**

### 2. Verificar API (FRONTEND_URL)

1. Acesse o projeto da **API** no dashboard da Vercel
2. Vá em **Settings** → **Environment Variables**
3. Confirme que `FRONTEND_URL` está com a URL correta do frontend:
   ```
   https://adota-pet-frontend.vercel.app
   ```
4. Se precisou alterar, faça **"Redeploy"**

---

## ✅ Parte 4: Testar o Deploy

### 1. Testar a API

Acesse: `https://adota-pet-api.vercel.app/api/docs`

Você deve ver a documentação Swagger da API.

### 2. Testar o Frontend

Acesse: `https://adota-pet-frontend.vercel.app`

- Teste o login
- Teste o cadastro
- Teste a listagem de pets
- Verifique se as requisições para a API estão funcionando

### 3. Verificar CORS

Se encontrar erros de CORS:
1. Verifique se `FRONTEND_URL` na API está correto
2. Verifique se a API está retornando os headers CORS corretos
3. Pode ser necessário adicionar múltiplas origens se tiver domínio customizado

---

## 🐛 Troubleshooting

### ❌ Erro: "Module not found" ou "Cannot find module"

**Solução**: Certifique-se de que todas as dependências estão no `dependencies` (não em `devDependencies`).

```bash
# Na pasta api, mova dependências necessárias em produção
npm install --save @nestjs/common @nestjs/core @nestjs/platform-express
```

### ❌ Erro: API não responde ou timeout

**Possíveis causas**:
1. Vercel tem limite de 10 segundos para serverless functions no plano gratuito
2. Verifique os logs no dashboard da Vercel
3. Cold starts podem ser lentos na primeira requisição

**Solução**: 
- Otimize queries do Supabase
- Implemente cache quando possível
- Considere usar Vercel Edge Functions para rotas simples

### ❌ Erro: CORS blocked

**Solução**:
1. Verifique `FRONTEND_URL` na API
2. Se usar domínio customizado, atualize a variável
3. Na API, em `main.ts`, você pode adicionar múltiplas origens:

```typescript
app.enableCors({
  origin: [
    process.env.FRONTEND_URL,
    'https://seu-dominio-customizado.com'
  ],
  credentials: true,
});
```

### ❌ Erro: Environment variable not defined

**Solução**:
1. Vá em **Settings** → **Environment Variables**
2. Verifique se todas as variáveis estão definidas
3. Clique em **"Redeploy"** após adicionar/editar variáveis

### ❌ Frontend carrega, mas requisições falham

**Solução**:
1. Abra o DevTools (F12) → Console
2. Verifique se `VITE_API_URL` está correto
3. No código, você pode verificar:
   ```javascript
   console.log('API URL:', import.meta.env.VITE_API_URL);
   ```

---

## 🎨 Parte 5: Domínio Customizado (Opcional)

### Para o Frontend:
1. Vá no projeto do frontend → **Settings** → **Domains**
2. Clique em **"Add"**
3. Digite seu domínio (ex: `adotapet.com`)
4. Configure o DNS conforme as instruções da Vercel

### Para a API:
1. Vá no projeto da API → **Settings** → **Domains**
2. Adicione um subdomínio (ex: `api.adotapet.com`)
3. Configure o DNS

### Atualizar variáveis após domínio customizado:
- Frontend: `VITE_API_URL` → `https://api.adotapet.com/api`
- API: `FRONTEND_URL` → `https://adotapet.com`
- **Redeploy** ambos os projetos

---

## 📊 Monitoramento

### Verificar logs:
1. Dashboard da Vercel → Seu projeto
2. Clique em **"Deployments"**
3. Clique no deployment específico
4. Vá em **"Logs"** ou **"Runtime Logs"**

### Métricas:
- Dashboard mostra analytics básicos gratuitamente
- Monitore uso de bandwidth e function invocations

---

## 💡 Dicas de Otimização

### Frontend:
1. **Code splitting**: O Vite já faz isso automaticamente
2. **Lazy loading**: Carregue rotas sob demanda
3. **Image optimization**: Use formatos modernos (WebP, AVIF)

### API:
1. **Caching**: Implemente cache com Redis (Vercel KV no plano pago) ou em memória
2. **Connection pooling**: Configure o Supabase para reutilizar conexões
3. **Otimize queries**: Use indexes no Supabase

### Geral:
1. **Comprimir assets**: Vite já faz gzip/brotli
2. **CDN**: Vercel já usa CDN globalmente
3. **Monitoring**: Configure Sentry ou similar para erros em produção

---

## 🔐 Segurança

### ⚠️ IMPORTANTE - Proteja suas credenciais:

1. **NUNCA** commite arquivos `.env` no Git
2. Use variáveis de ambiente da Vercel
3. Rotate suas secrets periodicamente (especialmente `JWT_SECRET`)
4. Configure RLS (Row Level Security) no Supabase

### Checklist de Segurança:
- [ ] `.env` está no `.gitignore`
- [ ] Todas as secrets estão em variáveis de ambiente da Vercel
- [ ] CORS está configurado corretamente
- [ ] RLS está ativado no Supabase
- [ ] JWT secret é forte (mínimo 32 caracteres)
- [ ] Supabase service key é mantida apenas na API (backend)

---

## 📝 Comandos Úteis

```bash
# Ver status de deployments
vercel ls

# Ver logs em tempo real
vercel logs adota-pet-api --follow

# Reverter para deployment anterior
vercel rollback

# Remover projeto
vercel remove adota-pet-frontend
```

---

## 🆘 Suporte

Se encontrar problemas:
1. Verifique a [documentação da Vercel](https://vercel.com/docs)
2. Consulte os logs no dashboard
3. Verifique a [comunidade Vercel](https://github.com/vercel/vercel/discussions)

---

## ✅ Checklist Final

Antes de considerar o deploy completo, verifique:

### Frontend:
- [ ] Build passa sem erros (`npm run build`)
- [ ] `VITE_API_URL` aponta para a API em produção
- [ ] Routing funciona (todas as rotas carregam)
- [ ] Imagens e assets carregam corretamente
- [ ] Login/Registro funcionam
- [ ] Requisições à API funcionam

### API:
- [ ] Build passa sem erros (`npm run build`)
- [ ] Todas as variáveis de ambiente estão configuradas
- [ ] Docs do Swagger estão acessíveis
- [ ] CORS permite o frontend
- [ ] Conexão com Supabase funciona
- [ ] Auth (login/registro) funciona
- [ ] CRUD de pets funciona

### Geral:
- [ ] `.env` não está commitado
- [ ] Secrets estão seguras
- [ ] Monitoramento configurado
- [ ] Domínio customizado configurado (se aplicável)

---

## 🎉 Conclusão

Após seguir este guia, você terá:
- ✅ Frontend React hospedado na Vercel
- ✅ API NestJS rodando em serverless functions
- ✅ Comunicação segura entre frontend e backend
- ✅ Deploy automático a cada push (se conectou via Git)

**Próximos passos**:
- Configure CI/CD para testes automáticos
- Implemente monitoring e alertas
- Adicione analytics
- Configure domínio customizado
- Otimize performance

Bom deploy! 🚀
