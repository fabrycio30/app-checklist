# ROLE: SENIOR FULLSTACK ARCHITECT & SECURITY EXPERT

Project: "Inspeção Transul" - Vehicle & Equipment Management System.

## 🧠 CHAIN-OF-THOUGHT (RACIOCÍNIO ESTRUTURADO):

1. **AUTH & ROLES:** Implementar Supabase Auth. Definir dois perfis: 'ADMIN' e 'COLABORADOR'.
2. **ADMIN EXPERIENCE:** Criar um Dashboard para:
   - Gerenciar Equipamentos (CRUD por Placa).
   - Gerenciar Templates (O Administrador deve poder criar perguntas de tipos diferentes: Texto, Dropdown, e o especial OK/NA/NC).
   - Visualizar Histórico de Inspeções concluídas com fotos.
3. **COLABORADOR EXPERIENCE (Mobile First):** Interface simplificada para o motorista:
   - Login persistente (importante para uso offline).
   - Busca de equipamento por placa.
   - Preenchimento do Checklist com modo offline (Dexie.js).
4. **NC LOGIC (Não Conformidade):** Regra rígida -> Se selecionado 'N/C', habilitar obrigatoriamente campo de texto e upload de fotos. O formulário não pode ser finalizado sem isso.
5. **OFFLINE SYNC:** Usar Service Workers para PWA e uma fila de sincronização no IndexedDB.

## 🛠️ STACK TÉCNICA:

- Next.js 14 (App Router), Tailwind CSS, Shadcn/UI.
- Supabase (Auth, PostgreSQL, Storage para fotos).
- Dexie.js (IndexedDB para persistência offline).
- Lucide React (Ícones).

## 📂 TAREFAS INICIAIS (PASSO A PASSO):

1. **Database Schema:** Gere o `schema.prisma` com as tabelas: `User` (com role), `Equipment` (placa, modelo, etc), `ChecklistTemplate` (configuração dinâmica), `Question` (com enums para os tipos: TEXT, DROPDOWN, OK_NA_NC, PHOTO) e `Inspection` (resultados).
2. **Auth Flow:** Configurar o Middleware do Next.js para proteger as rotas `/admin` (apenas ADMIN) e `/app` (ambos, mas com foco no Colaborador).
3. **Dynamic Form Engine:** Criar um componente que lê o JSON do `ChecklistTemplate` e renderiza os inputs corretos.
4. **Sync Mechanism:** Criar um Hook `useOfflineSync` que monitora a conexão e faz o 'push' das inspeções do Dexie para o Supabase automaticamente.

## 🎨 UI/UX GUIDELINES:

- Admin: Layout de tabela limpo, filtros por data e placa.
- Inspetor: Botões gigantes, contraste alto para sol forte, feedback visual de "Sincronizado" ou "Aguardando Conexão".
