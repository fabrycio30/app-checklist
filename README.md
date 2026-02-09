# Inspeção Transul

Sistema de gerenciamento de inspeções veiculares.

## Setup

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Configure o Ambiente:**
   Crie um arquivo `.env.local` na raiz com suas credenciais do Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
   DATABASE_URL="postgresql://postgres:password@db.seu-projeto.supabase.co:5432/postgres"
   ```

3. **Banco de Dados:**
   Rode as migrações do Prisma para criar as tabelas:
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Rodar o Projeto:**
   ```bash
   npm run dev
   ```

## Primeiro Acesso

O sistema utiliza Supabase Auth. Para o primeiro acesso:
1. Crie um usuário no painel do Supabase (Authentication -> Users).
2. Insira o mesmo usuário na tabela `User` do banco de dados (via SQL Editor do Supabase ou Prisma Studio `npx prisma studio`) definindo a role como `ADMIN`.

## Funcionalidades

- **Admin (/admin):**
  - Dashboard
  - Gestão de Equipamentos
  - Criação de Templates de Checklist (Dinâmico)
  - Visualização de Inspeções

- **Colaborador (/app):**
  - Funciona Offline (PWA/Dexie.js)
  - Busca de Veículos
  - Preenchimento de Checklist
  - Sincronização automática quando online
