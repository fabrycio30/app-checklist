# Configuração do Storage (Upload de Fotos)

Para que o upload de fotos funcione, você precisa criar um **Bucket** no Supabase Storage.

1.  Acesse o painel do seu projeto no [Supabase](https://supabase.com/dashboard).
2.  No menu lateral, clique em **Storage**.
3.  Clique no botão **"New Bucket"**.
4.  Preencha as informações:
    *   **Name of bucket:** `inspection-photos` (Exatamente este nome).
    *   **Public bucket:** Marque esta opção (ON).
    *   **Allowed MIME types:** Deixe em branco ou coloque `image/*`.
    *   **File size limit:** Pode deixar o padrão (ex: 5MB ou 10MB).
5.  Clique em **"Save"**.

## Políticas de Acesso (RLS Policies)

Para permitir que os usuários façam upload, você precisa configurar as políticas:

1.  Na aba **Configuration** do bucket `inspection-photos`, clique em **Policies**.
2.  Clique em **"New Policy"** -> **"For full customization"**.
3.  Crie uma política para **SELECT** (Visualizar):
    *   **Name:** `Public Access`
    *   **Allowed operations:** `SELECT`
    *   **Target roles:** `anon`, `authenticated` (ou apenas `authenticated` se preferir).
    *   **USING expression:** `true` (ou `bucket_id = 'inspection-photos'`)
4.  Crie uma política para **INSERT** (Upload):
    *   **Name:** `Authenticated Upload`
    *   **Allowed operations:** `INSERT`
    *   **Target roles:** `authenticated`
    *   **WITH CHECK expression:** `bucket_id = 'inspection-photos'` (e opcionalmente `auth.uid() = owner` se quiser restringir).

> **Dica Rápida:** Para testes, você pode criar uma política que permite tudo (`true` em USING e WITH CHECK) para `authenticated` users, mas cuidado em produção.
