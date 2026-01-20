# 🔐 Guia de Integração - Autenticação Frontend

## ✅ Implementações Concluídas

### 1. Cliente API (`src/lib/api.ts`)
Cliente Axios configurado com:
- ✅ Base URL da API (http://localhost:3000/api)
- ✅ Interceptors para adicionar token JWT automaticamente
- ✅ Tratamento de erros 401 (logout automático)
- ✅ Todos os serviços da API:
  - `authService`: login, register, logout
  - `userService`: getMe, updateMe, getONGs
  - `petService`: CRUD de pets
  - `applicationService`: candidaturas de adoção
  - `favoriteService`: favoritar pets

### 2. AuthContext (`src/contexts/AuthContext.tsx`)
- ✅ Integração com API real
- ✅ Login e registro conectados aos endpoints
- ✅ Gerenciamento de token JWT
- ✅ Persistência de usuário no localStorage
- ✅ Estado de loading para inicialização
- ✅ Logout automático em caso de token expirado

### 3. Tela de Login (`src/pages/Login.tsx`)
- ✅ Formulário conectado à API
- ✅ Tratamento de erros com toast
- ✅ Redirecionamento após login
- ✅ Suporte para adotante e ONG

### 4. Tela de Registro (`src/pages/Register.tsx`)
- ✅ Formulários de adotante e ONG
- ✅ Validação de senhas
- ✅ Integração com API
- ✅ Redirecionamento após registro

## 📋 Passos para Testar

### 1. Instalar Dependências

```bash
cd /media/dados/Desenvolvimento/Faculdade/adota-pet
npm install axios
```

### 2. Configurar Variáveis de Ambiente

O arquivo `.env` já foi criado com:
```
VITE_API_URL=http://localhost:3000/api
```

### 3. Atualizar Senha no Banco de Dados

Execute o script [update-passwords.sql](../api/database/update-passwords.sql) no Supabase SQL Editor:

```sql
UPDATE users 
SET password_hash = '$2b$10$HlHCjlFtl7D.vtZyep/0z.qjV89959o/frAOlfJqPgtU70bqPuYPW'
WHERE email = 'contato@patinhasfelizes.org';
```

### 4. Iniciar a API

```bash
cd api
npm run start:dev
```

Verifique se está rodando em: http://localhost:3000/api

### 5. Iniciar o Frontend

```bash
npm run dev
```

### 6. Testar Login

#### Credenciais de Teste (ONG):
- **Email**: contato@patinhasfelizes.org
- **Senha**: senha123
- **Tipo**: ONG

#### Credenciais de Teste (Adotante):
- **Email**: joao.silva@email.com
- **Senha**: senha123
- **Tipo**: Adotante

## 🔍 Fluxo de Autenticação

```
1. Usuário preenche formulário de login
   ↓
2. Login.tsx chama AuthContext.login()
   ↓
3. AuthContext.login() chama authService.login()
   ↓
4. authService faz POST para /api/auth/login
   ↓
5. API valida credenciais e retorna { access_token, user }
   ↓
6. authService salva token e user no localStorage
   ↓
7. AuthContext atualiza estado do usuário
   ↓
8. Login.tsx redireciona para dashboard
```

## 🔑 Gerenciamento de Token

### Armazenamento
- **Token JWT**: localStorage.setItem('token', token)
- **Dados do usuário**: localStorage.setItem('user', JSON.stringify(user))

### Uso Automático
Todas as requisições à API incluem automaticamente o header:
```
Authorization: Bearer <token>
```

### Expiração
- Token válido por 7 dias
- Ao receber erro 401, o interceptor:
  1. Remove token e user do localStorage
  2. Redireciona para /login

## 📊 Endpoints Utilizados

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro

### Usuários (requer autenticação)
- `GET /api/users/me` - Dados do usuário logado
- `PATCH /api/users/me` - Atualizar perfil
- `GET /api/users/ongs` - Listar ONGs
- `GET /api/users/ong/:id/statistics` - Estatísticas da ONG

### Pets (alguns requerem autenticação)
- `GET /api/pets` - Listar pets (público)
- `GET /api/pets/:id` - Detalhes do pet (público)
- `POST /api/pets` - Criar pet (apenas ONG)
- `GET /api/pets/my-pets` - Meus pets (apenas ONG)
- `PATCH /api/pets/:id` - Atualizar pet (apenas ONG dona)
- `DELETE /api/pets/:id` - Deletar pet (apenas ONG dona)

### Candidaturas (requer autenticação)
- `POST /api/applications` - Criar candidatura
- `GET /api/applications` - Minhas candidaturas
- `PATCH /api/applications/:id/status` - Atualizar status (apenas ONG)

### Favoritos (requer autenticação)
- `GET /api/favorites` - Meus favoritos
- `POST /api/favorites/:petId` - Adicionar favorito
- `DELETE /api/favorites/:petId` - Remover favorito

## 🚨 Tratamento de Erros

### Erros Comuns

1. **401 Unauthorized**
   - Token inválido ou expirado
   - Usuário não autenticado
   - Ação: Logout automático + redirecionamento

2. **403 Forbidden**
   - Usuário não tem permissão
   - Exemplo: Adotante tentando criar pet

3. **400 Bad Request**
   - Dados inválidos
   - Exemplo: Email já cadastrado

4. **404 Not Found**
   - Recurso não encontrado

### Exemplo de Tratamento

```tsx
try {
  await login(email, password, userType);
  // Sucesso
} catch (error: any) {
  toast({
    variant: "destructive",
    title: "Erro no login",
    description: error.message || "Erro desconhecido",
  });
}
```

## 🎯 Próximos Passos

### Para completar a integração frontend:

1. **Página de Pets** (`src/pages/Pets.tsx`)
   - [ ] Substituir dados mock por `petService.getPets()`
   - [ ] Implementar filtros (espécie, tamanho, cidade)
   - [ ] Integrar favoritos

2. **Detalhes do Pet** (`src/pages/PetDetail.tsx`)
   - [ ] Buscar dados com `petService.getPetById(id)`
   - [ ] Botão de favoritar
   - [ ] Botão de candidatura

3. **Formulário de Adoção** (`src/pages/AdoptionForm.tsx`)
   - [ ] Enviar formulário com `applicationService.createApplication()`

4. **Dashboard do Adotante** (`src/pages/AdopterDashboard.tsx`)
   - [ ] Buscar candidaturas com `applicationService.getMyApplications()`
   - [ ] Buscar favoritos com `favoriteService.getFavorites()`

5. **Dashboard da ONG** (`src/pages/ONGDashboard.tsx`)
   - [ ] Buscar pets com `petService.getMyPets()`
   - [ ] Buscar candidaturas recebidas
   - [ ] Estatísticas com `userService.getONGStatistics()`

## 🔒 Segurança

### Boas Práticas Implementadas

✅ Token JWT armazenado apenas no localStorage  
✅ Interceptor adiciona token automaticamente  
✅ Logout automático ao receber 401  
✅ Senhas nunca armazenadas no frontend  
✅ Validação de dados antes de enviar à API  
✅ CORS configurado na API  

### Recomendações Futuras

- [ ] Implementar refresh token
- [ ] Adicionar rate limiting
- [ ] Implementar HTTPS em produção
- [ ] Adicionar autenticação 2FA (opcional)

## 📝 Exemplo de Uso

```tsx
import { useAuth } from '@/contexts/AuthContext';
import { petService } from '@/lib/api';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  const [pets, setPets] = useState([]);

  useEffect(() => {
    async function loadPets() {
      try {
        const data = await petService.getPets({ city: 'São Paulo' });
        setPets(data);
      } catch (error) {
        console.error('Erro ao carregar pets:', error);
      }
    }
    
    loadPets();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <h1>Olá, {user?.name}</h1>
      <button onClick={logout}>Sair</button>
      {/* ... */}
    </div>
  );
}
```

## 🐛 Debugging

### Ver requests no console:
```tsx
// Em api.ts, adicione:
api.interceptors.request.use((config) => {
  console.log('REQUEST:', config.method, config.url, config.data);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('RESPONSE:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('ERROR:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);
```

### Verificar token no localStorage:
```javascript
localStorage.getItem('token')
localStorage.getItem('user')
```

### Testar endpoint manualmente:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"contato@patinhasfelizes.org","password":"senha123","user_type":"ong"}'
```
