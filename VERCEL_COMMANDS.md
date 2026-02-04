# 🛠️ Comandos Úteis - Vercel Deploy

## Instalação e Setup

```bash
# Instalar Vercel CLI globalmente
npm install -g vercel

# Fazer login na Vercel
vercel login

# Ver versão instalada
vercel --version
```

## Deploy

### Deploy do Frontend
```bash
# Na raiz do projeto
vercel

# Deploy em produção
vercel --prod

# Deploy com nome específico
vercel --name adota-pet-frontend --prod
```

### Deploy da API
```bash
# Entrar na pasta da API
cd api

# Deploy
vercel

# Deploy em produção
vercel --prod
```

## Gerenciamento de Projetos

```bash
# Listar todos os projetos
vercel ls

# Listar deployments de um projeto
vercel ls adota-pet-frontend

# Ver detalhes de um projeto
vercel inspect adota-pet-api
```

## Variáveis de Ambiente

```bash
# Adicionar variável de ambiente
vercel env add VITE_API_URL production

# Listar variáveis de ambiente
vercel env ls

# Remover variável de ambiente
vercel env rm VITE_API_URL production

# Adicionar arquivo .env completo
vercel env pull .env.production
```

### Adicionar múltiplas variáveis (API)
```bash
cd api

# Adicionar uma por vez
vercel env add SUPABASE_URL production
vercel env add SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_KEY production
vercel env add JWT_SECRET production
vercel env add JWT_EXPIRES_IN production
vercel env add NODE_ENV production
vercel env add FRONTEND_URL production
```

## Logs e Monitoramento

```bash
# Ver logs em tempo real
vercel logs adota-pet-api --follow

# Ver logs de um deployment específico
vercel logs <deployment-url>

# Ver últimos 100 logs
vercel logs adota-pet-frontend --limit=100
```

## Domínios

```bash
# Adicionar domínio customizado
vercel domains add adotapet.com

# Listar domínios
vercel domains ls

# Remover domínio
vercel domains rm adotapet.com

# Verificar configuração de domínio
vercel domains inspect adotapet.com
```

## Aliases

```bash
# Criar alias para deployment
vercel alias set <deployment-url> adotapet.com

# Listar aliases
vercel alias ls
```

## Rollback e Promoção

```bash
# Promover deployment preview para produção
vercel promote <deployment-url>

# Rollback para deployment anterior
vercel rollback

# Listar deployments para rollback
vercel ls adota-pet-frontend
# Copie a URL do deployment desejado
vercel promote <deployment-url>
```

## Remoção

```bash
# Remover um deployment específico
vercel rm <deployment-url>

# Remover projeto completo
vercel remove adota-pet-frontend

# Remover com confirmação automática (CUIDADO!)
vercel remove adota-pet-api --yes
```

## Build e Preview

```bash
# Build local (sem deploy)
vercel build

# Deploy preview (não vai para produção)
vercel

# Deploy preview com comentário
vercel --comment "Testing new feature"
```

## Informações do Projeto

```bash
# Ver informações do projeto atual
vercel

# Ver informações em JSON
vercel inspect --json

# Ver uso de recursos
vercel usage
```

## Secrets (Variáveis Sensíveis)

```bash
# Adicionar secret
vercel secrets add jwt-secret "meu-super-secret-jwt-123"

# Listar secrets
vercel secrets ls

# Renomear secret
vercel secrets rename jwt-secret new-jwt-secret

# Remover secret
vercel secrets rm jwt-secret

# Usar secret em env var
# No dashboard ou vercel.json:
# "JWT_SECRET": "@jwt-secret"
```

## Configuração Local

```bash
# Linkar projeto local ao projeto Vercel
vercel link

# Deslinkar projeto
vercel unlink

# Ver projeto linkado
vercel whoami
```

## Teams e Organizações

```bash
# Listar times
vercel teams ls

# Trocar de time
vercel switch <team-slug>

# Ver time atual
vercel whoami
```

## Troubleshooting

```bash
# Ver status da Vercel
curl https://www.vercel-status.com/api/v2/status.json

# Limpar cache local
rm -rf .vercel

# Re-linkar projeto
vercel link --yes

# Debug mode
vercel --debug

# Ver todas as opções
vercel --help
```

## Comandos Específicos do Projeto

### Verificar tudo antes do deploy
```bash
# Rodar script de verificação
./verify-deploy.sh
```

### Build local de teste
```bash
# Frontend
npm run build
npm run preview

# API
cd api
npm run build
npm run start:prod
```

### Limpar e rebuildar
```bash
# Frontend
rm -rf dist node_modules
npm install
npm run build

# API
cd api
rm -rf dist node_modules
npm install
npm run build
```

## Workflow Recomendado

### 1. Desenvolvimento Local
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: API
cd api
npm start
```

### 2. Teste de Build
```bash
# Verificar se tudo está ok
./verify-deploy.sh
```

### 3. Deploy Preview (teste)
```bash
# Frontend
vercel

# API
cd api
vercel
```

### 4. Deploy Produção
```bash
# Frontend
vercel --prod

# API
cd api
vercel --prod
```

### 5. Atualizar Environment Variables
```bash
# Via CLI ou Dashboard
# Atualizar VITE_API_URL e FRONTEND_URL
```

### 6. Redeploy
```bash
# Redeploy após atualizar env vars
vercel --prod --force
```

## Aliases Úteis (Adicione ao ~/.bashrc ou ~/.zshrc)

```bash
# Alias para comandos Vercel
alias vdeploy='vercel --prod'
alias vlogs='vercel logs --follow'
alias vlink='vercel link'
alias venv='vercel env ls'
alias vls='vercel ls'

# Alias específicos do projeto
alias deploy-frontend='cd /media/dados/Desenvolvimento/Faculdade/adota-pet && vercel --prod'
alias deploy-api='cd /media/dados/Desenvolvimento/Faculdade/adota-pet/api && vercel --prod'
alias deploy-all='deploy-frontend && deploy-api'
```

## Dicas Pro

1. **Deploy automático via Git**
   - Conecte repositório no dashboard
   - Cada push na branch main = deploy automático
   - Pull requests = preview deploy

2. **Environment por branch**
   - Production: branch `main`
   - Preview: outras branches
   - Desenvolvimento: local

3. **Monitoramento**
   - Configure alerts no dashboard
   - Integre com Sentry para erros
   - Use Vercel Analytics

4. **Performance**
   - Habilite Edge Caching
   - Use Vercel Image Optimization
   - Configure ISR (Incremental Static Regeneration) se aplicável

## Links Úteis

- Dashboard: https://vercel.com/dashboard
- Documentação: https://vercel.com/docs
- Status: https://www.vercel-status.com
- CLI Docs: https://vercel.com/docs/cli
- GitHub: https://github.com/vercel/vercel

## Suporte

- Documentação: https://vercel.com/docs
- Comunidade: https://github.com/vercel/vercel/discussions
- Twitter: https://twitter.com/vercel
- Discord: https://vercel.com/discord
