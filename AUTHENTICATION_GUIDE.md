# 🔐 Sistema de Autenticação - Guia de Teste

## Como Testar o Sistema de Login

### 1️⃣ Acessar a Tela de Login
- Navegue para: `http://localhost:8080/login`
- Você verá duas abas: **Adotante** e **ONG**

### 2️⃣ Fazer Login como ONG
1. Clique na aba **ONG**
2. Preencha qualquer email e senha (ex: `ong@test.com` / `123456`)
3. Clique em **"Entrar como ONG"**
4. Você será redirecionado para `/ong-dashboard`
5. No header, verá seu nome e opção de logout

### 3️⃣ Fazer Login como Adotante
1. Clique na aba **Adotante**
2. Preencha qualquer email e senha (ex: `user@test.com` / `123456`)
3. Clique em **"Entrar como Adotante"**
4. Você será redirecionado para `/adopter-dashboard`

### 4️⃣ Testar Proteção de Rotas

#### Cenário 1: Tentar acessar ONG Dashboard sem login
- **URL:** `http://localhost:8080/ong-dashboard`
- **Resultado:** Redirecionado para `/login`

#### Cenário 2: Adotante tenta acessar ONG Dashboard
1. Faça login como **Adotante**
2. Tente acessar `http://localhost:8080/ong-dashboard`
3. **Resultado:** Tela de "Acesso Restrito" com mensagem clara

#### Cenário 3: ONG tenta acessar Adotante Dashboard
1. Faça login como **ONG**
2. Tente acessar `http://localhost:8080/adopter-dashboard`
3. **Resultado:** Tela de "Acesso Restrito"

### 5️⃣ Testar Logout
1. Estando logado, clique no seu nome no header (desktop)
2. Clique em **"Sair"**
3. Você será deslogado e redirecionado para home
4. Tente acessar `/ong-dashboard` novamente
5. **Resultado:** Redirecionado para login

---

## 🎨 Funcionalidades Implementadas

### ✅ Sistema de Autenticação
- Context API para gerenciar estado global de auth
- Login persistido no localStorage
- Diferenciação entre ONG e Adotante

### ✅ Proteção de Rotas
- ProtectedRoute HOC que valida autenticação
- Validação de tipo de usuário (ONG vs Adotante)
- Tela de erro amigável para acessos não autorizados

### ✅ Interface de Login Melhorada
- Tabs para selecionar tipo de usuário
- Formulários separados para cada tipo
- Loading states durante login
- Toast notifications de sucesso/erro

### ✅ Header Dinâmico
- Mostra nome do usuário quando logado
- Dropdown menu com opções (Desktop)
- Sheet menu para mobile
- Botão de logout funcional
- Esconde "Área ONG" quando já logado

---

## 🔧 Credenciais de Teste

**Aceita qualquer combinação de email/senha!**

Sugestões:
- **ONG:** `ong@patinhas.com` / `senha123`
- **Adotante:** `joao@email.com` / `senha123`

---

## 📁 Arquivos Criados/Modificados

### Novos Arquivos:
- ✅ `src/contexts/AuthContext.tsx` - Gerenciamento de autenticação
- ✅ `src/components/ProtectedRoute.tsx` - Proteção de rotas
- ✅ `src/pages/Register.tsx` - Página de cadastro

### Arquivos Modificados:
- ✅ `src/pages/Login.tsx` - Login com tabs e validação
- ✅ `src/components/Header.tsx` - Menu com usuário logado
- ✅ `src/App.tsx` - Rotas protegidas e AuthProvider

---

## 🚀 Próximos Passos (Backend)

Quando integrar com backend:

1. **Substituir mock login por API:**
```typescript
const login = async (email: string, password: string, type: UserType) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, type })
  });
  const data = await response.json();
  // Salvar token JWT
};
```

2. **Adicionar refresh tokens**
3. **Validar tokens expirados**
4. **Proteger rotas no backend também**
