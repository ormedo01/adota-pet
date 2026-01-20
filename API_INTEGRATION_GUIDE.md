# 🚀 Guia de Implementação da API - Adota Pet

## 📊 Análise do Projeto Atual

Você tem um **frontend React** funcional com:
- ✅ Sistema de autenticação (mock)
- ✅ Formulário de adoção em 4 etapas
- ✅ Dashboard de ONG e Adotante
- ✅ Listagem e detalhes de pets
- ✅ Sistema de favoritos

## 🎯 O que foi criado na API

### ✅ Estrutura Completa
1. **Banco de Dados PostgreSQL (Supabase)**
   - Schema completo com todas as tabelas
   - Views para consultas otimizadas
   - Triggers automáticos
   - Row Level Security (RLS)

2. **API NestJS**
   - Módulo de Autenticação (JWT)
   - CRUD de Usuários (ONGs e Adotantes)
   - CRUD de Pets
   - Sistema de Candidaturas de Adoção
   - Sistema de Favoritos
   - Guards e validações

## 🔄 Próximos Passos para Integração

### 1️⃣ Configurar Supabase (15 min)

1. **Criar conta gratuita:**
   - Acesse https://supabase.com
   - Crie novo projeto (região: South America)

2. **Executar schema:**
   - Vá em SQL Editor
   - Cole o conteúdo de `api/database/schema.sql`
   - Execute (Run)

3. **Copiar credenciais:**
   - Settings > API
   - Copie: URL, anon key, service_role key
   - Cole no arquivo `api/.env`

### 2️⃣ Iniciar a API (5 min)

```bash
cd api
cp .env.example .env
# Edite .env com suas credenciais
npm install
npm run start:dev
```

API rodará em `http://localhost:3000/api`

### 3️⃣ Integrar Frontend com API (1-2 horas)

#### A. Criar arquivo de configuração da API

Crie `src/lib/api.ts`:

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const user = localStorage.getItem('user');
  if (user) {
    const { token } = JSON.parse(user);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
```

#### B. Atualizar AuthContext

Modifique `src/contexts/AuthContext.tsx`:

```typescript
import api from '@/lib/api';

const login = async (email: string, password: string, type: UserType) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password,
      user_type: type,
    });
    
    const { user, token } = response.data;
    const userData = { ...user, token };
    
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error('Erro no login:', error);
    return false;
  }
};

const register = async (data: RegisterData) => {
  try {
    const response = await api.post('/auth/register', data);
    const { user, token } = response.data;
    const userData = { ...user, token };
    
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error('Erro no registro:', error);
    throw error;
  }
};
```

#### C. Atualizar página de Pets

Modifique `src/pages/Pets.tsx`:

```typescript
import { useEffect, useState } from 'react';
import api from '@/lib/api';

const Pets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    species: '',
    size: '',
    search: '',
  });

  useEffect(() => {
    fetchPets();
  }, [filters]);

  const fetchPets = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.species) params.append('species', filters.species);
      if (filters.size) params.append('size', filters.size);
      if (filters.search) params.append('search', filters.search);

      const response = await api.get(`/pets?${params}`);
      setPets(response.data);
    } catch (error) {
      console.error('Erro ao buscar pets:', error);
    } finally {
      setLoading(false);
    }
  };

  // ... resto do componente
};
```

#### D. Atualizar formulário de adoção

Modifique `src/pages/AdoptionForm.tsx`:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    await api.post('/applications', formData);
    
    toast({
      title: "Candidatura enviada com sucesso! 🎉",
      description: `Sua candidatura para adotar ${pet.name} foi enviada!`,
    });
    
    navigate('/adopter-dashboard');
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Erro ao enviar candidatura",
      description: error.response?.data?.message || "Tente novamente",
    });
  } finally {
    setIsSubmitting(false);
  }
};
```

#### E. Atualizar Dashboards

**ONG Dashboard:**
```typescript
useEffect(() => {
  fetchMyPets();
  fetchApplications();
}, []);

const fetchMyPets = async () => {
  const response = await api.get('/pets/my-pets');
  setPets(response.data);
};

const fetchApplications = async () => {
  const response = await api.get('/applications');
  setApplications(response.data);
};
```

**Adopter Dashboard:**
```typescript
const fetchApplications = async () => {
  const response = await api.get('/applications');
  setApplications(response.data);
};

const fetchFavorites = async () => {
  const response = await api.get('/favorites');
  setFavorites(response.data);
};
```

### 4️⃣ Testar Fluxo Completo

1. **Registro:**
   - Crie conta de ONG
   - Crie conta de Adotante

2. **ONG:**
   - Login
   - Cadastre alguns pets
   - Veja estatísticas

3. **Adotante:**
   - Login
   - Navegue pelos pets
   - Favorite alguns
   - Preencha formulário de adoção
   - Acompanhe candidatura

4. **ONG:**
   - Veja candidaturas recebidas
   - Aprove/Rejeite candidaturas
   - Atualize status dos pets

## 🎨 Melhorias Sugeridas

### Curto Prazo:
1. **Upload de Imagens**
   - Integrar Supabase Storage
   - Permitir múltiplas fotos por pet

2. **Validações Aprimoradas**
   - CPF/CNPJ válidos
   - Validação de CEP com API ViaCEP

3. **Feedback Visual**
   - Loading states
   - Skeletons
   - Animações

### Médio Prazo:
1. **Sistema de Mensagens**
   - Chat entre ONG e Adotante
   - Notificações em tempo real

2. **Notificações Email**
   - Enviar email ao criar candidatura
   - Notificar aprovação/rejeição

3. **Filtros Avançados**
   - Por distância
   - Por características
   - Ordenação

## 💡 Por que Supabase é PERFEITO para seu MVP

### ✅ Vantagens:

1. **Gratuito para começar:**
   - 500MB de banco
   - 1GB de storage
   - 50.000 usuários
   - Perfeito para MVP e validação

2. **PostgreSQL completo:**
   - Triggers, views, functions
   - Queries complexas
   - Relacionamentos robustos

3. **Authentication pronta:**
   - JWT automático
   - OAuth (Google, GitHub)
   - Magic links

4. **Storage integrado:**
   - Para fotos dos pets
   - CDN global
   - Otimização automática

5. **Realtime:**
   - WebSockets prontos
   - Ideal para chat/notificações

6. **Dashboard visual:**
   - Gerenciar dados
   - Ver logs
   - Monitorar performance

7. **Escalável:**
   - Quando crescer, só mudar de plano
   - Mesma estrutura

### 📈 Plano de Crescimento:

**MVP (Gratuito):**
- Validar ideia
- Primeiros usuários
- Feedback

**Beta (Pro - $25/mês):**
- 8GB database
- 100GB storage
- Mais recursos

**Produção (Pay as you go):**
- Escala conforme uso
- Alta disponibilidade
- Backups automáticos

## 🐛 Troubleshooting Comum

### "Cannot connect to Supabase"
- Verifique .env
- Confirme que executou schema.sql
- Teste URL no navegador

### "JWT expired"
- Aumente JWT_EXPIRES_IN
- Implemente refresh token

### "CORS error"
- Verifique FRONTEND_URL no .env da API
- Confirme que API está rodando

### "Unauthorized"
- Verifique se token está sendo enviado
- Confirme que user_type está correto

## 📞 Suporte

Se tiver dúvidas:
1. Verifique README da API
2. Consulte docs do Supabase
3. Use o Discord da comunidade NestJS

## 🎓 Recursos de Aprendizado

- [NestJS Docs](https://docs.nestjs.com)
- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com)

---

**Boa sorte com seu MVP! 🚀🐾**
