# 🚀 GUIA DE HOSPEDAGEM – LOTO MASTER

## ✅ Compatibilidade com Plataformas

O LOTO MASTER é um projeto **100% front-end** (React + Tailwind CSS) sem backend, banco de dados ou requisições externas. Funciona perfeitamente em qualquer plataforma de hospedagem estática.

### **Plataformas Recomendadas**

#### **1. Netlify** ✅ RECOMENDADO
- **Compatibilidade:** Perfeita
- **Sem problemas de funcionamento:** Sim
- **Passos:**
  1. Fazer push do código para GitHub
  2. Conectar repositório no Netlify
  3. Build command: `pnpm build`
  4. Publish directory: `dist`
  5. Deploy automático

#### **2. Vercel** ✅ RECOMENDADO
- **Compatibilidade:** Perfeita
- **Sem problemas de funcionamento:** Sim
- **Passos:**
  1. Fazer push do código para GitHub
  2. Importar projeto no Vercel
  3. Framework: React
  4. Build command: `pnpm build`
  5. Output directory: `dist`
  6. Deploy automático

#### **3. GitHub Pages** ✅ FUNCIONA
- **Compatibilidade:** Boa
- **Sem problemas de funcionamento:** Sim (com configuração)
- **Nota:** Requer configuração de base path

#### **4. Railway** ✅ FUNCIONA
- **Compatibilidade:** Boa
- **Sem problemas de funcionamento:** Sim
- **Passos:**
  1. Conectar repositório GitHub
  2. Detecta automaticamente como projeto Node.js
  3. Build command: `pnpm build`
  4. Start command: `pnpm start`

---

## 📋 Pré-requisitos para Hospedagem

1. **Repositório GitHub** com o código do projeto
2. **Node.js 18+** (geralmente fornecido pela plataforma)
3. **pnpm** (geralmente fornecido pela plataforma)

---

## 🔧 Configuração para Netlify (Passo a Passo)

### **1. Preparar o Repositório**
```bash
cd /home/ubuntu/loto-master
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/seu-usuario/loto-master.git
git push -u origin main
```

### **2. Conectar no Netlify**
1. Acesse https://netlify.com
2. Clique em "Add new site" → "Import an existing project"
3. Selecione GitHub e autorize
4. Escolha o repositório `loto-master`
5. Configure:
   - **Build command:** `pnpm build`
   - **Publish directory:** `dist`
6. Clique em "Deploy site"

### **3. Pronto!**
- Seu site estará disponível em `https://seu-site.netlify.app`
- Atualizações automáticas ao fazer push no GitHub

---

## 🔧 Configuração para Vercel (Passo a Passo)

### **1. Preparar o Repositório**
(Mesmo que Netlify - veja acima)

### **2. Conectar no Vercel**
1. Acesse https://vercel.com
2. Clique em "Add New..." → "Project"
3. Selecione GitHub e autorize
4. Escolha o repositório `loto-master`
5. Vercel detecta automaticamente:
   - **Framework:** React
   - **Build command:** `pnpm build`
   - **Output directory:** `dist`
6. Clique em "Deploy"

### **3. Pronto!**
- Seu site estará disponível em `https://seu-site.vercel.app`
- Atualizações automáticas ao fazer push no GitHub

---

## ⚠️ Possíveis Problemas e Soluções

### **Problema: "Cannot find module 'jspdf'"**
- **Causa:** Dependências não instaladas
- **Solução:** Plataforma instala automaticamente via `pnpm install`

### **Problema: "Build failed"**
- **Causa:** Erro de compilação TypeScript
- **Solução:** Verifique se há erros no console local com `pnpm dev`

### **Problema: "localStorage não funciona"**
- **Causa:** Nunca acontece em navegadores modernos
- **Solução:** Dados são salvos automaticamente no browser

### **Problema: "PDF não baixa"**
- **Causa:** Bloqueador de pop-ups ou navegador antigo
- **Solução:** Desabilitar bloqueador de pop-ups ou usar navegador moderno

---

## ✅ Testes Pré-Hospedagem

Antes de fazer deploy, teste localmente:

```bash
# Instalar dependências
pnpm install

# Executar em desenvolvimento
pnpm dev

# Testar build
pnpm build

# Testar build em produção
pnpm preview
```

---

## 🌐 Domínio Customizado

### **Netlify**
1. Vá para "Site settings" → "Domain management"
2. Clique em "Add custom domain"
3. Siga as instruções para apontar DNS

### **Vercel**
1. Vá para "Settings" → "Domains"
2. Clique em "Add"
3. Digite seu domínio
4. Siga as instruções para apontar DNS

---

## 📊 Recomendação Final

**Melhor opção:** **Netlify** ou **Vercel**
- Ambas são gratuitas
- Ambas têm deploy automático
- Ambas suportam domínios customizados
- Ambas têm excelente performance

**Escolha:** Depende de preferência pessoal. Ambas funcionam perfeitamente com LOTO MASTER.

---

## 🔒 Segurança

- **Sem dados sensíveis:** Tudo é armazenado localmente no browser
- **Sem backend:** Nenhuma requisição para servidor
- **Sem banco de dados:** Nenhum dado é armazenado no servidor
- **Totalmente seguro:** Pode ser hospedado em qualquer lugar

---

**Versão:** 1.0  
**Data:** 28/01/2026  
**Status:** Pronto para Hospedagem
