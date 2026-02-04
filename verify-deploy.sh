#!/bin/bash

# Script de verificação pré-deploy para Vercel
# Executa testes de build antes de fazer deploy

echo "🔍 Verificando pré-requisitos para deploy na Vercel..."
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0

# 1. Verificar se .env existe e não está commitado
echo "📋 Verificando arquivos de ambiente..."
if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} .env encontrado"
    
    # Verificar se .env está no .gitignore
    if grep -q "^\.env$" .gitignore 2>/dev/null; then
        echo -e "${GREEN}✓${NC} .env está no .gitignore"
    else
        echo -e "${YELLOW}⚠${NC} AVISO: .env não está no .gitignore!"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${YELLOW}⚠${NC} .env não encontrado (ok se usar .env.example)"
fi

if [ -f "api/.env" ]; then
    echo -e "${GREEN}✓${NC} api/.env encontrado"
    
    if grep -q "^\.env$" api/.gitignore 2>/dev/null; then
        echo -e "${GREEN}✓${NC} api/.env está no .gitignore"
    else
        echo -e "${YELLOW}⚠${NC} AVISO: api/.env não está no .gitignore!"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${YELLOW}⚠${NC} api/.env não encontrado (ok se usar .env.example)"
fi

echo ""

# 2. Verificar build do frontend
echo "🏗️  Testando build do frontend..."
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Build do frontend passou"
    
    # Verificar se dist foi criado
    if [ -d "dist" ]; then
        echo -e "${GREEN}✓${NC} Diretório dist/ criado"
        
        # Verificar tamanho do build
        SIZE=$(du -sh dist | cut -f1)
        echo -e "${GREEN}✓${NC} Tamanho do build: $SIZE"
    else
        echo -e "${RED}✗${NC} Diretório dist/ não foi criado"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${RED}✗${NC} Build do frontend falhou!"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# 3. Verificar build da API
echo "🔧 Testando build da API..."
cd api
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Build da API passou"
    
    # Verificar se dist foi criado
    if [ -d "dist" ]; then
        echo -e "${GREEN}✓${NC} Diretório api/dist/ criado"
        
        # Verificar se main.js existe
        if [ -f "dist/main.js" ]; then
            echo -e "${GREEN}✓${NC} Arquivo api/dist/main.js encontrado"
        else
            echo -e "${RED}✗${NC} Arquivo api/dist/main.js não encontrado"
            ERRORS=$((ERRORS + 1))
        fi
    else
        echo -e "${RED}✗${NC} Diretório api/dist/ não foi criado"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${RED}✗${NC} Build da API falhou!"
    ERRORS=$((ERRORS + 1))
fi

cd ..
echo ""

# 4. Verificar arquivos de configuração do Vercel
echo "⚙️  Verificando configurações do Vercel..."
if [ -f "vercel.json" ]; then
    echo -e "${GREEN}✓${NC} vercel.json encontrado (frontend)"
else
    echo -e "${RED}✗${NC} vercel.json não encontrado (frontend)"
    ERRORS=$((ERRORS + 1))
fi

if [ -f "api/vercel.json" ]; then
    echo -e "${GREEN}✓${NC} api/vercel.json encontrado"
else
    echo -e "${RED}✗${NC} api/vercel.json não encontrado"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# 5. Verificar TypeScript
echo "📝 Verificando TypeScript..."
npx tsc --noEmit --skipLibCheck > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} TypeScript check passou (frontend)"
else
    echo -e "${YELLOW}⚠${NC} TypeScript check teve avisos (frontend)"
fi

cd api
npx tsc --noEmit --skipLibCheck > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} TypeScript check passou (API)"
else
    echo -e "${YELLOW}⚠${NC} TypeScript check teve avisos (API)"
fi

cd ..
echo ""

# 6. Verificar variáveis de ambiente necessárias
echo "🔐 Checklist de variáveis de ambiente para configurar na Vercel:"
echo ""
echo "📱 Frontend (adota-pet-frontend):"
echo "   - VITE_API_URL (configurar após deploy da API)"
echo ""
echo "🔧 API (adota-pet-api):"
echo "   - SUPABASE_URL"
echo "   - SUPABASE_ANON_KEY"
echo "   - SUPABASE_SERVICE_KEY"
echo "   - JWT_SECRET"
echo "   - JWT_EXPIRES_IN"
echo "   - NODE_ENV"
echo "   - FRONTEND_URL (configurar após deploy do frontend)"
echo ""

# 7. Resumo final
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ Tudo pronto para deploy!${NC}"
    echo ""
    echo "Próximos passos:"
    echo "1. Instale a Vercel CLI: npm install -g vercel"
    echo "2. Faça login: vercel login"
    echo "3. Deploy do frontend: vercel (na raiz)"
    echo "4. Deploy da API: cd api && vercel"
    echo "5. Configure as variáveis de ambiente"
    echo "6. Atualize VITE_API_URL e FRONTEND_URL com as URLs reais"
    echo ""
    echo "Ou siga o guia completo em VERCEL_DEPLOYMENT_GUIDE.md"
else
    echo -e "${RED}❌ Encontrados $ERRORS erro(s)${NC}"
    echo ""
    echo "Corrija os erros acima antes de fazer deploy."
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
