# 📋 Sistema de Adoção - Guia Completo

## 🎯 Nova Funcionalidade: Formulário de Adoção

### Fluxo Completo de Adoção

```
Pet Detail Page
     ↓
Clica "Quero Adotar"
     ↓
Verifica se está logado
     ↓
[Se não logado] → Tela pedindo login/registro
[Se logado] → Formulário de Adoção (4 etapas)
     ↓
Preenche formulário
     ↓
Submete candidatura
     ↓
Redirecionado para Dashboard
```

---

## 📝 Estrutura do Formulário

### Etapa 1: Dados Pessoais e Endereço
**Campos:**
- Nome completo
- Data de nascimento
- Email
- Telefone
- CPF
- Endereço completo (rua, cidade, estado, CEP)

**Validação:**
- Todos os campos são obrigatórios
- Email pré-preenchido se logado

---

### Etapa 2: Informações sobre Moradia
**Campos:**
- Tipo de moradia (Casa/Apartamento)
- Propriedade (Própria/Alugada/Familiares)
- Possui quintal? (Sim/Não)
  - Se sim: É cercado?
- Quantas pessoas moram na casa?
- Há crianças? (Sim/Não)
  - Se sim: Quais idades?
- Todos concordam com a adoção? (Checkbox)

**Por que essas perguntas?**
- ONGs precisam saber se o ambiente é adequado
- Importante para segurança do pet e das crianças
- Verifica consenso familiar

---

### Etapa 3: Experiência com Pets
**Campos:**
- Possui outros pets atualmente? (Sim/Não)
  - Se sim: Descreva-os
- Experiência anterior com pets (Textarea)
- Horas que o pet ficará sozinho
- Quem cuida quando viajar?
- Está preparado financeiramente? (Sim/Parcialmente)
- Orçamento mensal estimado

**Por que essas perguntas?**
- Avalia experiência do adotante
- Verifica compatibilidade com outros pets
- Garante condições financeiras adequadas

---

### Etapa 4: Motivação e Compromisso
**Campos:**
- Por que deseja adotar este pet? (Textarea)
- O que faria se precisasse mudar? (Textarea)
- Termos de compromisso (2 checkboxes obrigatórios):
  1. Compromisso de longo prazo
  2. Concordância com visitas de acompanhamento

**Avisos importantes:**
- Candidatura será analisada pela ONG
- Retorno em até 7 dias úteis
- Pode haver entrevista/visita
- Acompanhar status no dashboard

---

## 🎨 Funcionalidades da Interface

### ✅ Sistema de Navegação por Etapas
- **Progress bar** visual (4 etapas)
- Botões "Anterior" e "Próximo"
- Indicador de etapa atual
- Última etapa tem botão "Enviar Candidatura"

### ✅ Card do Pet no Topo
- Foto do pet
- Nome, espécie e idade
- Nome da ONG responsável
- Ícone de coração

### ✅ Formulários Condicionais
- Campos aparecem/desaparecem baseado em respostas
- Exemplo: Se tem quintal → pergunta se é cercado
- Exemplo: Se tem crianças → pergunta idades

### ✅ Validações
- Campos obrigatórios marcados com `*`
- Checkboxes de termos obrigatórios
- Botão submit desabilitado sem aceitar termos
- Loading state durante submissão

### ✅ Proteção de Acesso
- **Não logado:** Tela pedindo login/cadastro
- **Logado:** Acesso ao formulário completo
- Dados do usuário pré-preenchidos (nome, email)

---

## 🧪 Como Testar

### Teste 1: Usuário Não Logado
1. **SEM fazer login**, acesse um pet
2. Clique em "Quero Adotar"
3. ✅ Verá tela pedindo para fazer login
4. Opções: "Fazer Login" ou "Criar Conta"

### Teste 2: Fluxo Completo de Adoção
1. Faça login como **Adotante** (`user@test.com` / `senha123`)
2. Vá para: http://localhost:8080/pets/1
3. Clique em **"Quero Adotar Thor"**
4. ✅ Formulário de adoção aparece

**Preencha as 4 etapas:**

**Etapa 1:** Dados pessoais (já vem alguns preenchidos)
- Preencha data de nascimento, telefone, CPF
- Complete o endereço

**Etapa 2:** Moradia
- Selecione tipo de moradia
- Responda sobre quintal
- Informe pessoas/crianças
- Marque "todos concordam"

**Etapa 3:** Experiência
- Responda sobre pets atuais
- Descreva experiência
- Informe disponibilidade
- Estime orçamento

**Etapa 4:** Finalização
- Escreva motivação
- Responda sobre mudança
- ✅ **IMPORTANTE:** Marque os 2 checkboxes de termos
- Clique em "Enviar Candidatura"

5. ✅ Toast de sucesso aparece
6. ✅ Redirecionado para `/adopter-dashboard`

### Teste 3: Validação de Termos
1. Chegue até a etapa 4
2. **NÃO marque** os checkboxes de termos
3. Tente clicar em "Enviar Candidatura"
4. ✅ Botão fica desabilitado
5. ✅ Toast de erro aparece

---

## 🎨 Design System

### Cores e Ícones
- **Primary:** Elementos principais
- **Muted:** Backgrounds suaves
- **Ícones:** Users, Home, Clock, DollarSign, CheckCircle2

### Componentes Utilizados
- ✅ Card, CardContent, CardHeader
- ✅ Input, Textarea, Label
- ✅ RadioGroup, Checkbox
- ✅ Button (com loading state)
- ✅ Separator
- ✅ Badge
- ✅ Progress indicators customizados

### Responsividade
- ✅ Mobile-first design
- ✅ Grid adaptável (md:grid-cols-2, md:grid-cols-3)
- ✅ Campos full-width em mobile
- ✅ Botões de navegação responsivos

---

## 📊 Estado do Formulário

Todos os dados são gerenciados em um único estado:

```typescript
formData = {
  // Pessoais
  fullName, email, phone, cpf, birthDate,
  
  // Endereço
  address, city, state, zipCode,
  
  // Moradia
  housingType, housingOwnership, hasYard, yardFenced,
  
  // Família
  householdSize, hasChildren, childrenAges, allAgree,
  
  // Pets
  hasPets, petsDescription, hadPetsHistory,
  
  // Disponibilidade
  dailyHoursAlone, whoCaresWhenAway,
  
  // Financeiro
  financialReady, monthlyBudget,
  
  // Motivação
  adoptionReason, whatIfMoving,
  
  // Termos
  commitment, termsAccepted
}
```

---

## 🚀 Próximos Passos (Backend)

Quando integrar com backend:

### 1. Endpoint de Submissão
```typescript
POST /api/adoptions
Body: {
  petId: string,
  adopterId: string,
  formData: {...}
}
```

### 2. Validações Server-side
- Verificar se pet está disponível
- Validar CPF
- Verificar se usuário já candidatou-se

### 3. Notificações
- Email para ONG (nova candidatura)
- Email para adotante (confirmação)
- Notificação in-app

### 4. Status da Candidatura
- Pendente (inicial)
- Em Análise
- Entrevista Agendada
- Aprovada / Rejeitada
- Concluída

### 5. Dashboard Updates
- Listar candidaturas no dashboard do adotante
- Listar candidaturas no dashboard da ONG
- Sistema de mensagens entre ONG e adotante

---

## 📁 Arquivos Criados

### Novo Arquivo:
- ✅ `src/pages/AdoptionForm.tsx` - Formulário completo de adoção

### Arquivos Modificados:
- ✅ `src/App.tsx` - Nova rota `/pets/:id/adopt`
- ✅ `src/pages/PetDetail.tsx` - Botão redireciona para formulário

---

## 💡 Dicas de UX Implementadas

1. **Pre-fill de Dados:** Email e nome já vêm preenchidos
2. **Campos Condicionais:** Aparecem apenas quando necessário
3. **Progress Visual:** Usuário sabe onde está no processo
4. **Validação Clara:** Asteriscos em campos obrigatórios
5. **Loading States:** Feedback durante submissão
6. **Toast Notifications:** Sucesso/erro bem visíveis
7. **Proteção de Acesso:** Não logado vê tela amigável
8. **Informações Contextuais:** Alerta sobre próximos passos

---

## ✨ Melhorias Futuras Sugeridas

1. **Máscaras de Input:**
   - CPF: `000.000.000-00`
   - Telefone: `(00) 00000-0000`
   - CEP: `00000-000`

2. **Upload de Documentos:**
   - RG/CPF
   - Comprovante de residência
   - Fotos da casa/quintal

3. **Integração CEP:**
   - Buscar endereço automaticamente via ViaCEP

4. **Salvar Progresso:**
   - LocalStorage para não perder dados
   - Retomar de onde parou

5. **Validação com Zod:**
   - Validações mais robustas
   - Mensagens de erro personalizadas

---

**Tudo pronto para teste! 🎉**
