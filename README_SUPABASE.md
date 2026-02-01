# LOTO MASTER - Integração Supabase

Este projeto foi refatorado para utilizar o Supabase como backend, permitindo persistência de dados, autenticação de usuários e cálculos automáticos de sorteio.

## Configuração do Banco de Dados

Para que o sistema funcione corretamente, você deve executar o script SQL contido no arquivo `supabase_schema.sql` no Editor SQL do seu painel Supabase.

### Tabelas Criadas:
- `profiles`: Armazena os perfis de usuário (admin, vendedor).
- `bolões`: Gerencia os ciclos de bolão (aberto, encerrado, concluído).
- `apostas`: Armazena todas as apostas vinculadas a um bolão e vendedor.
- `public_ranking`: Tabela auxiliar para visualização rápida.

## Autenticação

O sistema suporta três níveis de acesso:
1.  **Casual (Livre):** Acesso apenas à tela de apostas. Ao salvar, gera um link/texto para validação via WhatsApp com o ADM.
2.  **Vendedor:** Requer login. Pode registrar apostas que são salvas automaticamente na "Lista Válida" e visualizar seu próprio histórico.
3.  **Admin:** Requer login. Possui controle total: gerencia bolões, realiza sorteios, edita/exclui qualquer aposta e define premiações.

### Como criar usuários:
Os usuários devem ser criados via painel do Supabase (Auth). Após criar o usuário, insira um registro na tabela `profiles` vinculando o `id` do usuário ao seu respectivo `role` ('admin' ou 'vendedor').

## Funcionalidades Implementadas

- **Cálculo Automático:** Na área de sorteio, ao selecionar os 15 números, o sistema varre todas as apostas do bolão e calcula instantaneamente os acertos (10, 9, 8 ou 0 pontos).
- **Repetição de Jogos:** Na área "Últimas Apostas", vendedores e admins podem selecionar jogos de bolões anteriores e replicá-los no bolão atual com um clique.
- **Páginas Públicas:** `/public` exibe o ranking do último bolão concluído e `/public-list` exibe as apostas do bolão que está ocorrendo no momento.

## Variáveis de Ambiente

Certifique-se de que o arquivo `client/src/lib/supabase.ts` contenha a URL e a Anon Key corretas do seu projeto Supabase.
