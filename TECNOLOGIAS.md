# Tecnologias do Projeto: Adota Pet

Este documento lista as principais tecnologias, frameworks e bibliotecas utilizadas no desenvolvimento do projeto, divididas entre Frontend e Backend (API).

## 💻 Frontend

O frontend da aplicação foi desenvolvido com foco em performance, tipagem estática e componentes modernos.

### Core
- **React**: Biblioteca principal para construção da interface de usuário.
- **Vite**: Ferramenta de build extremamente rápida, utilizada como bundler sob a configuração com SWC.
- **TypeScript**: Superset de JavaScript que adiciona tipagem estática ao código.

### Estilização e UI
- **Tailwind CSS**: Framework CSS utility-first para estilização rápida e responsiva.
- **shadcn/ui** (baseado em **Radix UI**): Componentes acessíveis, customizáveis e sem estilos predefinidos pesados. Utilitários associados incluem `clsx`, `tailwind-merge` e `class-variance-authority`.
- **Lucide React**: Biblioteca de ícones.

### Roteamento e Gerenciamento de Estado
- **React Router DOM**: Gerenciamento de rotas e navegação na aplicação (Single Page Application).
- **React Query (@tanstack/react-query)**: Gerenciamento de estado de servidor, cache de requisições e sincronização de dados.

### Requisições, Formulários e Validação
- **Axios**: Cliente HTTP para lidar com as chamadas à API.
- **React Hook Form**: Gerenciamento eficiente da estrutura e estado dos formulários.
- **Zod**: Declaração e validação de esquemas (schema validation) integrado com o React Hook Form (via `@hookform/resolvers`).

### Outras Ferramentas Relevantes
- **Recharts**: Criação de gráficos e visualização de dados.
- **date-fns**: Manipulação ágil de datas.
- **Sonner**: Para envio de notificações do tipo toast.

---

## ⚙️ Backend (API)

A API do projeto foi construída utilizando uma arquitetura robusta e escalável, focando em manutenibilidade.

### Core e Framework
- **NestJS**: Framework Node.js progressivo para a construção de aplicações backend eficientes e escaláveis, utilizando Express sob o capô.
- **TypeScript**: Tipagem estática em todos os serviços, controllers e módulos do backend.

### Banco de Dados e Integração
- **Supabase (@supabase/supabase-js)**: Utilizado para integração com o banco de dados (provavelmente PostgreSQL gerenciado) e potencialmente storage.

### Autenticação e Segurança
- **JWT (JSON Web Token)** e **Passport (@nestjs/passport, passport-jwt)**: Implementação de estratégias de autenticação e autorização das rotas.
- **Bcrypt**: Hashing seguro de senhas.

### Validação e Transformação
- **class-validator** e **class-transformer**: Validação e transformação de dados provenientes das requisições, utilizando o padrão de validação por decorators do NestJS (Pipes).

### Documentação
- **Swagger (@nestjs/swagger, swagger-ui-express)**: Autogeração de documentação interativa para a API padrão OpenAPI.

### Testes
- **Jest / Supertest**: Frameworks utilizados para testes unitários e testes end-to-end (E2E) no backend.
