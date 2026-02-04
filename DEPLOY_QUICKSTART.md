# 🚀 Deploy Rápido - Resumo Executivo

## ✅ Status Atual
- ✓ Builds testados e funcionando
- ✓ Arquivos de configuração Vercel criados
- ✓ TypeScript validado
- ✓ .gitignore configurado

## 📦 O que foi preparado

### 1. Arquivos criados:
- `vercel.json` - Configuração do frontend
- `api/vercel.json` - Configuração da API
- `.vercelignore` - Arquivos ignorados no deploy (frontend)
- `api/.vercelignore` - Arquivos ignorados no deploy (API)
- `.gitignore` - Proteção de arquivos sensíveis
- `VERCEL_DEPLOYMENT_GUIDE.md` - Guia completo passo a passo
- `verify-deploy.sh` - Script de verificação

## 🎯 Próximos 3 Passos

### Opção A: Deploy via Dashboard (Recomendado para iniciantes)

1. **Criar conta e importar projeto**
   - Acesse: https://vercel.com/signup
   - Conecte seu GitHub/GitLab
   - Importe o repositório

2. **Deploy Frontend (1º projeto)**
   - Nome: `adota-pet-frontend`
   - Root Directory: `.` (raiz)
   - Framework: Vite
   - Adicione variável: `VITE_API_URL` = `placeholder` (atualizar depois)
   - Clique em Deploy

3. **Deploy API (2º projeto)**
   - Nome: `adota-pet-api`
   - Root Directory: `api`
   - Framework: Other
   - Adicione TODAS as variáveis de ambiente listadas abaixo
   - Clique em Deploy

### Opção B: Deploy via CLI (Mais rápido)

```bash
# 1. Instalar CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy frontend
vercel --prod
# Seguir prompts, aceitar padrões

# 4. Deploy API
cd api
vercel --prod
# Seguir prompts, aceitar padrões
```

## 🔐 Variáveis de Ambiente

### Frontend (adota-pet-frontend)
Apenas 1 variável:
```
VITE_API_URL = https://sua-api.vercel.app/api
```
⚠️ Atualizar após deploy da API

### API (adota-pet-api)
7 variáveis (copie do seu `.env`):
```
SUPABASE_URL = https://vmomuhwalrflusvfdrmc.supabase.co
SUPABASE_ANON_KEY = [seu valor]
SUPABASE_SERVICE_KEY = [seu valor]
JWT_SECRET = [seu valor]
JWT_EXPIRES_IN = 7d
NODE_ENV = production
FRONTEND_URL = https://seu-frontend.vercel.app
```
⚠️ FRONTEND_URL: atualizar após deploy do frontend

## 🔄 Atualização Cruzada (IMPORTANTE!)

Depois que ambos estiverem no ar:

1. **Pegar URL da API** (ex: `https://adota-pet-api.vercel.app`)
2. **Ir no frontend** → Settings → Environment Variables
3. **Atualizar** `VITE_API_URL` = `https://adota-pet-api.vercel.app/api`
4. **Redeploy** o frontend

5. **Pegar URL do frontend** (ex: `https://adota-pet-frontend.vercel.app`)
6. **Ir na API** → Settings → Environment Variables
7. **Atualizar** `FRONTEND_URL` = `https://adota-pet-frontend.vercel.app`
8. **Redeploy** a API

## 🧪 Testar Deploy

### API:
```
https://sua-api.vercel.app/api/docs
```
Deve mostrar a documentação Swagger

### Frontend:
```
https://seu-frontend.vercel.app
```
Deve carregar a página inicial

### Teste de integração:
1. Faça login no frontend
2. Navegue até a lista de pets
3. Verifique se carrega os dados da API

## 📱 Limites do Plano Gratuito

- ✅ Bandwidth: 100 GB/mês
- ✅ Builds: Ilimitados
- ✅ Serverless Functions: 125.000 invocações/mês
- ✅ Function Duration: 10 segundos
- ✅ Projetos: 200 deploys/dia

**Suficiente para**: Desenvolvimento, testes, portfólio, pequenos projetos

## ⚠️ Avisos Importantes

1. **Cold Starts**: Primeira requisição pode ser lenta (2-5s)
2. **Timeout**: Funções tem limite de 10s no plano free
3. **Secrets**: Configure TODAS as env vars na Vercel (não usar .env em prod)
4. **CORS**: Certifique-se que FRONTEND_URL está correta

## 🆘 Problemas Comuns

| Problema | Solução |
|----------|---------|
| Erro 404 nas rotas | Verificar vercel.json rewrites |
| CORS blocked | Verificar FRONTEND_URL na API |
| API timeout | Otimizar queries Supabase |
| Build falha | Rodar `npm run build` localmente primeiro |
| Env vars não funcionam | Redeploy após adicionar variáveis |

## 📚 Documentação Completa

Para guia detalhado com troubleshooting:
👉 **Leia: `VERCEL_DEPLOYMENT_GUIDE.md`**

## ✅ Checklist Pré-Deploy

- [x] Build frontend testado
- [x] Build API testado
- [x] TypeScript sem erros
- [x] Arquivos de config criados
- [x] .gitignore configurado
- [ ] Variáveis de ambiente preparadas
- [ ] Conta Vercel criada
- [ ] Projeto importado

## 🎉 Você está pronto!

Execute os 3 passos acima e sua aplicação estará no ar em ~10 minutos!

Lembre-se:
- Fazer 2 projetos separados (frontend + API)
- Configurar variáveis de ambiente
- Atualizar URLs cruzadas
- Testar tudo

Boa sorte! 🚀
