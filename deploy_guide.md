# 🚀 Guia Completo de Deploy - Chat Omegle com Vídeo/Áudio

## ⚠️ IMPORTANTE: WebRTC Requer HTTPS

WebRTC **NÃO funciona** em HTTP (exceto localhost). Você **DEVE** ter HTTPS/SSL em produção para vídeo e áudio funcionarem.

Todas as plataformas recomendadas abaixo fornecem SSL automático e gratuito.

## 📋 Preparação Inicial (Para Todas as Opções)

### 1. Modificar server.js para produção

Altere a linha da porta para:
```javascript
const PORT = process.env.PORT || 3000;
```

### 2. Criar arquivo .gitignore

```
node_modules/
.env
*.log
.DS_Store
```

### 3. Criar repositório no GitHub

```bash
git init
git add .
git commit -m "Initial commit - Chat Omegle"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/chat-omegle.git
git push -u origin main
```

---

## 🎯 OPÇÃO 1: Render.com (RECOMENDADO) ⭐⭐⭐

**Vantagens:** Grátis, fácil, suporta WebSocket, SSL automático, **funciona com WebRTC**

### Passo a Passo:

1. **Acesse:** https://render.com
2. **Cadastre-se** (pode usar conta GitHub)
3. **Dashboard → New +** → **Web Service**
4. **Conecte seu repositório GitHub**
5. **Configure:**
   - Name: `chat-omegle` (ou qualquer nome)
   - Region: Oregon (US West) - escolha o mais próximo
   - Branch: `main`
   - Runtime: **Node**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: **Free**
6. **Click "Create Web Service"**
7. **Aguarde 2-3 minutos** para o deploy
8. **Sua URL:** `https://chat-omegle-xxx.onrender.com` (já com SSL! ✅)

### ✅ WebRTC funcionará perfeitamente!

O SSL automático do Render permite que vídeo/áudio funcionem sem configuração adicional.

### ⚠️ Limitação do Plano Grátis:
- Após 15 minutos de inatividade, o servidor "dorme"
- Primeira requisição após dormir leva ~30 segundos
- **Para vídeo chamadas 24/7:** Use plano pago ($7/mês)

---

## 🎯 OPÇÃO 2: Railway.app ⭐⭐⭐

**Vantagens:** Deploy instantâneo, $5 grátis/mês, muito fácil, **SSL automático**

### Passo a Passo:

1. **Acesse:** https://railway.app
2. **Login com GitHub**
3. **New Project** → **Deploy from GitHub repo**
4. **Selecione seu repositório**
5. **Railway detecta automaticamente** as configurações
6. **Deploy automático começa!**
7. **Settings** → **Generate Domain** para obter URL pública
8. **Pronto!** URL com HTTPS: `https://chat-omegle-production.up.railway.app` ✅

### ✅ WebRTC funciona perfeitamente com SSL automático!

### 💰 Custos:
- $5 grátis por mês (suficiente para testes)
- Depois: ~$5-10/mês dependendo do uso
- **Recomendado para produção séria**

---

## 🎯 OPÇÃO 3: Fly.io ⭐

**Vantagens:** Performance global, grátis até certo limite

### Passo a Passo:

1. **Instalar CLI:**
```bash
curl -L https://fly.io/install.sh | sh
# ou
brew install flyctl  # Mac
```

2. **Login:**
```bash
fly auth login
```

3. **Na pasta do projeto:**
```bash
fly launch
```

4. **Responda as perguntas:**
   - App name: `chat-omegle-seu-nome`
   - Region: Escolha o mais próximo (gru = São Paulo)
   - PostgreSQL: **No**
   - Deploy now: **Yes**

5. **Fly.io cria automaticamente `fly.toml`**

6. **Deploy futuro:**
```bash
fly deploy
```

7. **Abrir app:**
```bash
fly open
```

### ⚙️ Configurações no fly.toml:

Fly.io geralmente cria automaticamente, mas verifique:

```toml
app = "chat-omegle"

[build]

[http_service]
  internal_port = 3000
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0
```

---

## 🎯 OPÇÃO 4: Heroku

**Vantagens:** Tradicional, documentação extensa

### Preparação:

1. **Criar arquivo `Procfile` (sem extensão):**
```
web: node server.js
```

2. **Instalar CLI:**
```bash
npm install -g heroku
```

3. **Login:**
```bash
heroku login
```

4. **Criar app:**
```bash
heroku create chat-omegle-seu-nome
```

5. **Deploy:**
```bash
git push heroku main
```

6. **Abrir:**
```bash
heroku open
```

### 💰 Custos:
- Grátis não existe mais no Heroku
- Plano básico: $7/mês

---

## 🎯 OPÇÃO 5: Vercel (NÃO RECOMENDADO para WebSocket)

⚠️ **Vercel não suporta WebSocket bem**. Use apenas para projetos estáticos ou com API Routes simples.

---

## 🎯 OPÇÃO 6: DigitalOcean / AWS / Azure (Avançado)

**Para quem quer controle total:**

### DigitalOcean Droplet:

1. **Criar Droplet Ubuntu** ($6/mês)
2. **SSH no servidor:**
```bash
ssh root@SEU_IP
```

3. **Instalar Node.js:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs
```

4. **Instalar PM2:**
```bash
npm install -g pm2
```

5. **Clonar seu projeto:**
```bash
git clone https://github.com/SEU_USUARIO/chat-omegle.git
cd chat-omegle
npm install
```

6. **Iniciar com PM2:**
```bash
pm2 start server.js --name chat-omegle
pm2 startup
pm2 save
```

7. **Configurar Nginx (opcional, para SSL):**
```bash
apt install nginx certbot python3-certbot-nginx
```

---

## 🔒 Adicionar HTTPS/SSL

### Para Render/Railway/Fly:
✅ **SSL automático** - não precisa fazer nada!

### Para servidor próprio (DigitalOcean):
```bash
certbot --nginx -d seudominio.com
```

---

## 📊 Comparação Rápida

| Plataforma | Preço | Facilidade | WebSocket | SSL | Performance |
|------------|-------|------------|-----------|-----|-------------|
| **Render** | Grátis* | ⭐⭐⭐⭐⭐ | ✅ | ✅ | ⭐⭐⭐ |
| **Railway** | $5→$10 | ⭐⭐⭐⭐⭐ | ✅ | ✅ | ⭐⭐⭐⭐ |
| **Fly.io** | Grátis* | ⭐⭐⭐⭐ | ✅ | ✅ | ⭐⭐⭐⭐⭐ |
| **Heroku** | $7/mês | ⭐⭐⭐⭐ | ✅ | ✅ | ⭐⭐⭐⭐ |
| **DigitalOcean** | $6/mês | ⭐⭐ | ✅ | Manual | ⭐⭐⭐⭐⭐ |

*Grátis com limitações (inatividade, recursos)

---

## 🎯 Minha Recomendação

### Para começar:
1. **Render.com** - Deploy em 5 minutos, grátis

### Para produção séria:
1. **Railway** - Melhor custo-benefício ($5-10/mês)
2. **Fly.io** - Performance global excelente

### Para aprender/controle total:
1. **DigitalOcean** - Servidor VPS completo

---

## 🔧 Configurações Adicionais de Produção

### 1. Adicionar variáveis de ambiente (.env)

Crie arquivo `.env`:
```
NODE_ENV=production
PORT=3000
```

Instale dotenv:
```bash
npm install dotenv
```

No `server.js`:
```javascript
require('dotenv').config();
```

### 2. Adicionar logs

```bash
npm install winston
```

### 3. Rate limiting (prevenir spam)

```bash
npm install express-rate-limit
```

### 4. Helmet (segurança)

```bash
npm install helmet
```

---

## 📱 Testando o Deploy

Após o deploy:

1. **Abra 2 abas anônimas** do navegador
2. **Acesse a URL do seu deploy**
3. **Inicie chat em ambas**
4. **Teste a comunicação**

---

## 🐛 Troubleshooting

**"Application Error" ou 503:**
- Verifique os logs da plataforma
- Confirme que `PORT` usa `process.env.PORT`

**WebSocket não conecta:**
- Verifique se a plataforma suporta WebSocket
- Confirme que não há firewall bloqueando

**Servidor dorme (Render grátis):**
- Use UptimeRobot para pingar a cada 5 minutos
- Ou upgrade para plano pago

---

## 🎉 Pronto!

Escolha sua plataforma favorita e faça o deploy! 

**Recomendação:** Comece com **Render.com** (grátis e fácil), depois migre para **Railway** se precisar de mais performance.

Boa sorte! 🚀