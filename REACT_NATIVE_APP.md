# 📱 App React Native - Controle de Acesso

Este documento descreve o app mobile de controle de acesso criado como parte do projeto Adota Pet.

## 📍 Localização

O app React Native está localizado na pasta: **`react-native-app/`**

## 🎯 Objetivo

Criar um aplicativo mobile com 3 telas para controle de acesso:
1. **Login** - Autenticação de usuários
2. **Listagem** - Visualização de usuários cadastrados
3. **Cadastro/Edição** - Gerenciamento de usuários

## 🎨 Design

O app foi desenvolvido seguindo o design fornecido nas imagens, com:
- Interface dark mode
- Campos de entrada minimalistas
- Botões de ação destacados
- Navegação intuitiva

## 💾 Armazenamento

Utiliza **AsyncStorage** para persistência local de dados:
- Lista de usuários
- Sessão do usuário logado

## 🚀 Como Usar

### Instalação
```bash
cd react-native-app
npm install
```

### Execução
```bash
npm start
```

### Primeiro Acesso
Use as credenciais padrão:
- **Login**: admin
- **Senha**: admin123

## 📚 Documentação

Dentro da pasta `react-native-app/` você encontrará:

- **README.md** - Documentação completa e detalhada
- **QUICKSTART.md** - Guia rápido de início
- **ESTRUTURA.md** - Estrutura do projeto e arquitetura

## 🛠️ Tecnologias

- React Native + Expo
- TypeScript
- React Navigation
- AsyncStorage

## 📱 Funcionalidades

✅ Login com validação
✅ Listagem de usuários
✅ Cadastro de novos usuários  
✅ Edição de usuários existentes
✅ Exclusão de usuários
✅ Logout
✅ Persistência local de dados
✅ Usuário padrão automático

## 🔗 Relação com o Projeto Web

Este app mobile é uma versão standalone do sistema de controle de acesso, desenvolvido separadamente do projeto web ReactJS principal, mas compartilhando os mesmos conceitos e design.

---

Para mais informações, consulte a documentação dentro da pasta `react-native-app/`.
