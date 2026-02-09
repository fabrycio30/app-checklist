# Guia de Configuração do Supabase

Siga estes passos para configurar seu banco de dados e conectar ao projeto.

## 1. Criar Projeto no Supabase
1. Acesse [supabase.com](https://supabase.com) e faça login.
2. Clique em **"New Project"**.
3. Escolha sua organização.
4. Preencha os detalhes:
   - **Name:** Inspeção Transul (ou o nome que preferir)
   - **Database Password:** Crie uma senha forte e **SALVE-A** (você vai precisar dela na etapa 3).
   - **Region:** Escolha a região mais próxima (ex: São Paulo).
5. Clique em **"Create new project"**. Aguarde alguns minutos até o projeto ser provisionado.

## 2. Obter Chaves de API (URL e Anon Key)
1. No painel do seu projeto, vá em **Settings** (ícone de engrenagem na barra lateral esquerda).
2. Clique em **API**.
3. Na seção **Project URL**, copie a URL.
   - Cole no seu arquivo `.env.local` em `NEXT_PUBLIC_SUPABASE_URL`.
4. Na seção **Project API keys**, encontre a chave `anon` e `public`.
   - Cole no seu arquivo `.env.local` em `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## 3. Obter String de Conexão (Database URL)
1. Ainda em **Settings**, clique em **Database** na barra lateral.
2. Role até a seção **Connection parameters** (ou Connection String).
3. Certifique-se de que a aba **URI** está selecionada.
4. Copie a string de conexão. Ela se parece com:
   `postgresql://postgres.xxxx:[YOUR-PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:5432/postgres`
5. Cole no seu arquivo `.env.local` em `DATABASE_URL`.
6. **Importante:** Substitua `[YOUR-PASSWORD]` pela senha que você criou no passo 1. Remova os colchetes.
   - Exemplo final: `postgresql://postgres.abcdef:minhasenha123@aws-0-sa-east-1.pooler.supabase.com:5432/postgres`

   *Dica: Se tiver problemas com caracteres especiais na senha, você precisará codificá-los (URL Encode).*

## 4. Configurar Autenticação (Opcional por enquanto)
1. Vá em **Authentication** -> **Providers** no menu lateral.
2. Certifique-se de que "Email" está habilitado.
3. Desabilite "Confirm email" se quiser testar mais rápido sem precisar validar emails reais (Authentication -> URL Configuration -> Confirm email).

## 5. Inicializar o Banco de Dados
Agora que o `.env.local` está configurado, volte ao terminal do VS Code e rode:

```bash
npx prisma migrate dev --name init
```

Isso criará as tabelas no seu banco de dados Supabase.
