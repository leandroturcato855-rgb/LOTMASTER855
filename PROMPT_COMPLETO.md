# 📋 PROMPT COMPLETO – PROJETO LOTO MASTER

## 🎯 Objetivo Geral

Criar um sistema **100% front-end (HTML, CSS, JS)** chamado **LOTO MASTER**, responsivo (PC e celular), sem banco de dados e sem histórico. Sistema de gerenciamento de bolões de loteria com registro, conferência, ranking e geração de PDF profissional.

---

## 🔐 PÁGINAS DO SISTEMA

### **1️⃣ Página Login**
- Autenticação simples com credenciais fixas no código
- Usuário: `admin`
- Senha: `admin123`
- Apenas para acesso do administrador
- Após login, redireciona para Dashboard

### **2️⃣ Página Registro de Apostas**
- Campo: **Nome do apostador** (até 32 caracteres, MAIÚSCULO)
- Grid com **25 números (01 a 25)** clicáveis
- Cada aposta possui **exatamente 10 números**
- Exibir números selecionados automaticamente
- **Botão "Jogo Aleatório"** - Gera 10 números aleatórios automaticamente
- **Botão "Adicionar à Lista"** - Permite múltiplos jogos do mesmo apostador
  - Exibe lista com formato: `Nome Apostador | 01`, `Nome Apostador | 02`, etc.
  - Cada jogo é numerado sequencialmente
- **Botão "Salvar Apostas"** - Salva todos os jogos em memória e limpa a tela
- **SEM animações** que atrapalhem os botões (remover scale, transition)
- Layout em linha horizontal para caber no celular

### **3️⃣ Página Participantes**
- Exibe todos os jogos salvos
- Ordenação: **A-Z por nome do apostador**
- **Campo de Pesquisa** - Filtra jogos por nome do apostador
- **Botão "Baixar Lista em PDF"** - Exporta lista de apostas em PDF profissional
  - Inclui: Data, hora, tabela com Apostador | Jogo | Números
  - Layout limpo com cores roxo/verde
- **Botão "Encerrar Apostas"** - Move os jogos para a próxima tela (Lista Atual)
- Após encerrar, lista fica vazia

### **4️⃣ Página Lista Atual**
- Exibe jogos encerrados aguardando sorteio
- Tabela com: Apostador | Jogo | Números
- **Botão "Baixar Lista em PDF"** - Exporta lista em PDF
- **Link Público** - Gera URL compartilhável (`/public`) que exibe apenas ranking
- Informação: "Vá para Sorteio para inserir números"

### **5️⃣ Página Sorteio (Protegida por Senha)**
- **Senha de Acesso:** `MASTER3552`
- Após autenticação, exibe:
  - **Campo "Números Sorteados"** - Inserir 15 números (01-25)
    - **Validação robusta:**
      - Impede números duplicados (aviso em tempo real)
      - Valida intervalo 01-25 (rejeita fora do intervalo)
      - Feedback visual em caixa vermelha com lista de erros
      - Contagem: "X/15 números válidos"
      - Aceita múltiplos formatos (espaços, vírgulas)
  - **Campo "Prêmio 10 Pontos"** - Valor em R$
  - **Campo "Prêmio 9 Pontos"** - Valor em R$
  - **Botão "Salvar Prêmios"** - Salva valores
  - **Exibição de Números Sorteados** - Mostra números inseridos em chips verdes
  - **Ranking Automático:**
    - Calcula acertos de cada aposta
    - Ordena por maior pontuação
    - Exibe tabela: Apostador | Jogo | Acertos (em verde) | Pontos (em preto) | Prêmio
    - Pontos em amarelo (10 acertos) ou preto (9 acertos)
  - **Botão "Baixar PDF"** - Gera PDF profissional com:
    - Título: "LOTO MASTER – RESULTADO OFICIAL"
    - Data e hora
    - Números sorteados em blocos verdes
    - Tabela de premiação (10 e 9 pontos)
    - Ranking com acertos destacados em verde
    - QR code que aponta para link público
    - Rodapé: "Resultado gerado automaticamente"
    - Layout limpo, profissional, cores roxo/verde
  - **Botão "Salvar e Gerar Link"** - Salva resultados e gera link público

### **6️⃣ Página Pública (`/public`)**
- **Link Compartilhável** - Sem autenticação necessária
- **Exibição:**
  - Números sorteados em destaque (verde)
  - Prêmios para 10 e 9 pontos
  - Ranking em linha horizontal:
    - Formato: APTE | APOSTADOR | GRUPOS JOGADOS | PONTOS
    - Números acertados em verde
    - Números não acertados em roxo/cinza claro
    - Pontos em amarelo (10) ou preto (9)
  - **Botão "Copiar Link"** - Copia URL com feedback visual
  - **Botão "Compartilhar WhatsApp"** - Abre WhatsApp com link
  - **Botão "Baixar PDF"** - Download do resultado
- **Mobile First** - 100% otimizado para celular
- Layout em linha horizontal para caber na tela

---

## 🎨 DESIGN & VISUAL

- **Paleta de Cores:**
  - Roxo primário: `#6B46C1`
  - Verde-esmeralda (acertos): `#10B981`
  - Amarelo (10 pontos): `#FBBF24`
  - Preto (9 pontos): `#1F2937`
  - Branco/cinza neutro para base

- **Tipografia:**
  - Display: Poppins Bold
  - Body: Inter Regular
  - Monospace: Courier New (para números)

- **Componentes:**
  - Cards arredondados com sombra sutil
  - Botões grandes e fáceis de clicar (mobile)
  - Sem animações que atrapalhem interação
  - Layout responsivo (mobile first)

---

## ⚙️ REGRAS IMPORTANTES

- ❌ Sem banco de dados
- ❌ Sem histórico persistente
- ❌ Sem animações que atrapalhem botões
- ✔️ Tudo em memória (localStorage)
- ✔️ Apenas 1 sorteio por sessão
- ✔️ Link público somente leitura
- ✔️ Interface simples e moderna
- ✔️ Validação robusta de entrada
- ✔️ PDF profissional e bonito
- ✔️ QR code no PDF para fácil compartilhamento

---

## 📱 FUNCIONALIDADES PRINCIPAIS

### **Fluxo Completo:**
1. **Login** → Autenticação
2. **Registro** → Adicionar apostas (jogo aleatório + lista múltipla)
3. **Participantes** → Pesquisa + Download PDF + Encerrar apostas
4. **Lista Atual** → Visualizar jogos + Download PDF
5. **Sorteio** → Inserir números (validados) + Prêmios + Ranking + PDF + Link
6. **Público** → Compartilhar resultado (WhatsApp, link, PDF)

### **Validações:**
- Nome apostador: até 32 caracteres, MAIÚSCULO
- Números aposta: exatamente 10 (01-25)
- Números sorteio: exatamente 15 (01-25), sem duplicatas
- Prêmios: valores numéricos

### **Compartilhamento:**
- Link público sem autenticação
- QR code no PDF
- Botão WhatsApp
- Botão Copiar Link
- Download PDF em qualquer etapa

---

## 🧾 ESPECIFICAÇÕES TÉCNICAS

### **Stack:**
- React 19 + Tailwind CSS 4
- jsPDF para geração de PDF
- QRCode para geração de QR code
- localStorage para persistência em memória
- Sem banco de dados

### **Responsividade:**
- Mobile first
- Breakpoints: mobile, tablet, desktop
- Layout horizontal em linha para caber no celular
- Botões grandes (py-3 mínimo)

### **Performance:**
- Sem animações desnecessárias
- Carregamento rápido
- Sem requisições externas (exceto fonts)

---

## 📝 NOTAS IMPORTANTES

1. **Sem Histórico:** Cada nova sessão começa do zero
2. **localStorage:** Dados persistem apenas durante a sessão
3. **Link Público:** Gerado automaticamente após salvar resultados
4. **PDF:** Deve ser baixável em qualquer página
5. **Validação:** Rigorosa para números sorteados
6. **Mobile:** 100% otimizado para celular
7. **Cores:** Roxo/verde/amarelo/preto conforme especificado
8. **Layout:** Horizontal em linha para caber na tela

---

## 🚀 PRÓXIMOS PASSOS (OPCIONAIS)

1. Histórico de sorteios com datas
2. Exportar Excel/CSV
3. Botão Limpar/Reset
4. Customização de cores
5. Notificações por email
6. Integração com WhatsApp Business API

---

**Versão:** 1.0  
**Data:** 28/01/2026  
**Status:** Completo e Funcional
