# LOTO MASTER - Sistema de Gerenciamento de Bolões Lotofácil

Plataforma completa para gerenciar bolões da Lotofácil com autenticação por perfil, cálculo automático de acertos e ranking em tempo real.

## 🎯 Funcionalidades

### Perfis de Acesso
- **Casual (Livre):** Acesso sem login para fazer apostas. Ao salvar, gera mensagem para validação via WhatsApp.
- **Vendedor:** Login com persistência. Apostas salvas automaticamente como válidas. Acesso à lista de participantes e histórico.
- **Admin:** Controle total. Gerencia bolões, sorteios, cálculo de acertos e ranking.

### Funcionalidades Principais
- ✅ Seleção de 25 números em grid 5x5
- ✅ Jogo aleatório automático
- ✅ Persistência de apostas no Supabase
- ✅ Lista válida de apostas (com busca e filtros)
- ✅ Histórico de apostas para repetição
- ✅ Área de sorteio com 15 números
- ✅ Cálculo automático de acertos
- ✅ Ranking com destaque para ganhadores
- ✅ Páginas públicas para compartilhamento
- ✅ Integração WhatsApp para suporte

## 🚀 Stack Tecnológico

- **Frontend:** React 19 + TypeScript + Tailwind CSS 4
- **Backend:** Supabase (PostgreSQL + Auth)
- **Hospedagem:** Netlify (CI/CD automático)
- **Versionamento:** GitHub

## 📋 Pré-requisitos

- Node.js 22+
- pnpm 10+
- Conta Supabase configurada
- Repositório GitHub
- Conta Netlify

## 🔧 Setup Local

### 1. Clonar o Repositório
```bash
git clone https://github.com/leandroturcato855-rgb/LOTMASTER855.git
cd LOTMASTER855
```

### 2. Instalar Dependências
```bash
pnpm install
```

### 3. Configurar Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://rbikopikencverqxxkbl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiaWtvcGlrZW5jdmVycXh4a2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5ODAxMzIsImV4cCI6MjA4NTU1NjEzMn0.9zPvhjndMw0bsIGNvfuVclO-7BLZlhlSFlr_DiMvglk
VITE_WHATSAPP_LINK=https://wa.me/qr/ISNQMHEGV762P1
```

### 4. Executar em Desenvolvimento
```bash
pnpm dev
```

A aplicação estará disponível em `http://localhost:5173`

## 🗄️ Configuração do Banco de Dados

O script SQL `supabase_schema.sql` já foi executado no seu projeto Supabase. Ele cria:

- Tabela `profiles` - Perfis de usuários (admin, vendedor, casual)
- Tabela `apostas` - Registro de apostas
- Tabela `sorteios` - Histórico de sorteios
- Tabela `acertos` - Cálculo de acertos por aposta
- Políticas RLS - Controle de acesso por perfil

## 🔐 Autenticação

### Fluxo de Login
1. **Casual:** Clique em "Acesso Casual" - sem necessidade de login
2. **Vendedor/Admin:** Insira email e senha
   - Primeira vez: Clique em "Criar Conta" e selecione o perfil
   - Próximas vezes: Use "Entrar"

### Controle de Acesso por Rota
- `/login` - Página de autenticação
- `/dashboard` - Área principal (requer autenticação)
- `/public` - Ranking público (sem autenticação)
- `/public-list` - Lista de apostas pública (sem autenticação)

## 📦 Build e Deploy

### Build Local
```bash
pnpm build
```

Gera os arquivos em `dist/`

### Deploy no Netlify

#### Opção 1: Conectar GitHub (Recomendado)
1. Acesse https://app.netlify.com
2. Clique em "Add new site" → "Import an existing project"
3. Selecione GitHub e autorize
4. Escolha o repositório `LOTMASTER855`
5. Configure as variáveis de ambiente (veja seção abaixo)
6. Clique em "Deploy site"

#### Opção 2: Deploy Manual
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

### Variáveis de Ambiente no Netlify
Vá em **Site settings** → **Build & deploy** → **Environment** e adicione:

```
VITE_SUPABASE_URL=https://rbikopikencverqxxkbl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiaWtvcGlrZW5jdmVycXh4a2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5ODAxMzIsImV4cCI6MjA4NTU1NjEzMn0.9zPvhjndMw0bsIGNvfuVclO-7BLZlhlSFlr_DiMvglk
VITE_WHATSAPP_LINK=https://wa.me/qr/ISNQMHEGV762P1
```

## 📱 Fluxo de Uso

### Para Casual
1. Clique em "Acesso Casual"
2. Selecione 25 números ou use "Jogo Aleatório"
3. Clique em "Adicionar Apostas"
4. Clique em "Salvar Apostas"
5. Copie a mensagem e envie para o ADM via WhatsApp

### Para Vendedor
1. Faça login com email e senha
2. Registre apostas (salvas automaticamente como válidas)
3. Acesse "Lista Válida" para gerenciar
4. Acesse "Últimas Apostas" para repetir jogos anteriores
5. Veja "Último Bolão" para conferir resultados

### Para Admin
1. Faça login como admin
2. Acesse "Sorteio" para criar novo sorteio
3. Selecione 15 números sorteados
4. Clique em "Validar Sorteio" para calcular acertos
5. Clique em "Concluir e Salvar Bolão"
6. Veja o ranking em "Último Bolão"

## 🧪 Testes

### Testar Autenticação Local
```bash
# Terminal 1: Rodar dev server
pnpm dev

# Terminal 2: Testar com curl (opcional)
curl http://localhost:5173/dashboard
```

### Testar Fluxos
1. **Casual:** Acesse sem login, faça aposta, copie mensagem
2. **Vendedor:** Crie conta, faça login, registre apostas
3. **Admin:** Crie conta admin, faça sorteio, veja ranking

## 📝 Estrutura de Arquivos

```
LOTMASTER855/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.tsx          # Autenticação
│   │   │   ├── Dashboard.tsx      # Área principal
│   │   │   ├── PublicResults.tsx  # Ranking público
│   │   │   └── PublicList.tsx     # Lista pública
│   │   ├── components/
│   │   │   ├── RegisterBets.tsx   # Registro de apostas
│   │   │   ├── Participants.tsx   # Lista válida
│   │   │   ├── DrawLottery.tsx    # Sorteio
│   │   │   ├── CurrentGames.tsx   # Histórico
│   │   │   └── LastBolan.tsx      # Ranking
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx    # Gerenciamento de auth
│   │   ├── lib/
│   │   │   └── supabase.ts        # Cliente Supabase
│   │   └── App.tsx                # Rotas principais
│   └── public/
├── server/
│   └── index.ts                   # Servidor Express
├── supabase_schema.sql            # Schema do banco
├── .env.example                   # Variáveis de exemplo
└── package.json
```

## 🐛 Troubleshooting

### Erro: "Supabase connection failed"
- Verifique se as variáveis de ambiente estão corretas
- Confirme que o projeto Supabase está ativo
- Teste a conexão em `https://rbikopikencverqxxkbl.supabase.co`

### Erro: "Authentication failed"
- Limpe o localStorage: `localStorage.clear()`
- Verifique se a tabela `profiles` existe no Supabase
- Confirme que a política RLS está configurada

### Deploy no Netlify não funciona
- Verifique se as variáveis de ambiente estão no Netlify
- Confirme que o build command é `pnpm build`
- Verifique o publish directory: `dist`

## 📞 Suporte

Para dúvidas ou problemas, entre em contato via WhatsApp: https://wa.me/qr/ISNQMHEGV762P1

## 📄 Licença

MIT - Veja LICENSE para detalhes

---

**Desenvolvido com ❤️ para gerenciar bolões de forma simples e eficiente.**
