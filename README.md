# 💬📹 Chat Omegle - Sistema Completo com Vídeo e Áudio

Sistema de chat anônimo em tempo real estilo Omegle, 100% funcional com WebSocket e WebRTC.

## 🚀 Características

✅ **Chat em tempo real** - WebSocket com Socket.IO
✅ **Vídeo chamada P2P** - WebRTC para vídeo em tempo real
✅ **Áudio em tempo real** - Chamadas de voz com WebRTC
✅ **3 modos de chat** - Texto, Texto+Áudio, Texto+Vídeo
✅ **Conexão aleatória** - Sistema de fila inteligente por modo
✅ **Indicador de digitação** - Veja quando o estranho está digitando
✅ **Controles de mídia** - Ligar/desligar câmera e microfone
✅ **Múltiplas sessões** - Suporta vários usuários simultâneos
✅ **Interface moderna** - Design responsivo e animado
✅ **Desconexão automática** - Gerenciamento inteligente de conexões

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- NPM ou Yarn

## 🔧 Instalação

### Passo 1: Criar estrutura de pastas

```bash
mkdir chat-omegle
cd chat-omegle
mkdir public
```

### Passo 2: Criar arquivos

Crie os seguintes arquivos na pasta raiz:

1. **package.json** (use o conteúdo do artifact "package.json")
2. **server.js** (use o conteúdo do artifact "server.js")

Crie o arquivo na pasta `public`:

3. **public/index.html** (use o conteúdo do artifact "index.html")

### Passo 3: Instalar dependências

```bash
npm install
```

### Passo 4: Iniciar o servidor

```bash
npm start
```

Ou para desenvolvimento com auto-reload:

```bash
npm run dev
```

### Passo 5: Acessar o chat

Abra seu navegador em: **http://localhost:3000**

## 🎮 Como Usar

1. **Abra duas ou mais janelas** do navegador em `http://localhost:3000`
2. **Escolha o modo** de chat:
   - 💬 **Apenas Texto** - Chat tradicional
   - 🎤 **Texto + Áudio** - Conversa por voz + mensagens
   - 📹 **Texto + Vídeo** - Vídeo chamada + mensagens
3. Clique em **"Iniciar Novo Chat"** em ambas as janelas
4. **Permita acesso** à câmera/microfone quando solicitado (para modos áudio/vídeo)
5. Quando um usuário encontrar o outro no mesmo modo, vocês estarão conectados!
6. Digite mensagens e/ou use vídeo/áudio para conversar
7. Use os botões 📹 e 🎤 para ligar/desligar câmera e microfone
8. Use **"Parar"** para desconectar ou **"Novo Chat"** para encontrar outro parceiro

## ⚙️ Requisitos para Vídeo/Áudio

- **HTTPS obrigatório** em produção (WebRTC exige conexão segura)
- **Navegadores compatíveis**: Chrome, Firefox, Safari, Edge (versões recentes)
- **Permissões**: Câmera e microfone devem ser autorizados
- **Localhost funciona sem HTTPS** para testes

## 📁 Estrutura do Projeto

```
chat-omegle/
├── server.js           # Servidor Node.js com Socket.IO
├── package.json        # Dependências do projeto
└── public/
    └── index.html      # Interface do cliente
```

## 🛠️ Tecnologias Utilizadas

- **Backend:** Node.js + Express + Socket.IO
- **Frontend:** HTML5 + CSS3 + JavaScript
- **WebSocket:** Socket.IO para comunicação em tempo real
- **WebRTC:** Para vídeo e áudio P2P (peer-to-peer)
- **STUN Servers:** Google STUN para NAT traversal

## 🔍 Como Funciona

### Sistema de Fila por Modo

1. Usuários escolhem um modo (texto, áudio ou vídeo)
2. Entram em uma fila de espera específica para aquele modo
3. Quando dois usuários do mesmo modo estão esperando, são conectados automaticamente
4. Se um usuário está sozinho no modo escolhido, aguarda até alguém chegar

### WebRTC (Vídeo e Áudio)

1. Após o match no Socket.IO, inicia-se a negociação WebRTC
2. **Signaling** via Socket.IO (troca de SDP offers/answers e ICE candidates)
3. Conexão **P2P direta** entre os navegadores para mídia
4. **STUN servers** ajudam a atravessar NAT/Firewalls
5. Stream de vídeo/áudio flui diretamente entre usuários (baixa latência)

### Gerenciamento de Conexões

- Cada usuário recebe um ID único do Socket.IO
- Conexões ativas são mapeadas (usuário A ↔ usuário B)
- Desconexões são detectadas e notificam o parceiro
- Streams de mídia são limpos adequadamente ao desconectar

### Mensagens em Tempo Real

- Mensagens são enviadas diretamente ao parceiro via WebSocket
- Indicador de "digitando" aparece em tempo real
- Sistema escapa HTML para segurança

## 🌐 Testando com Múltiplos Usuários

### Opção 1: Múltiplas abas/janelas

Abra várias janelas do navegador no mesmo computador

### Opção 2: Dispositivos na mesma rede

1. Descubra seu IP local:
   - Windows: `ipconfig`
   - Mac/Linux: `ifconfig` ou `ip addr`
2. Acesse de outros dispositivos: `http://SEU_IP:3000`

### Opção 3: Modo de navegação anônima

Use janelas anônimas para simular diferentes usuários

## 🔐 Segurança

- ✅ Escape de HTML nas mensagens (previne XSS)
- ✅ Validação de mensagens vazias
- ✅ Limpeza de conexões órfãs
- ✅ WebRTC P2P (mídia não passa pelo servidor)
- ⚠️ **Nota:** Este é um projeto de demonstração. Para produção, adicione:
  - **HTTPS/SSL obrigatório** (Let's Encrypt)
  - **TURN servers** para NAT simétrico (coturn, Twilio, etc)
  - Rate limiting
  - Autenticação
  - Moderação de conteúdo
  - Sistema de denúncias
  - Banco de dados para logs
  - Análise de abuso/spam

## 📝 Melhorias Futuras

- [ ] **TURN server** para melhor conectividade (NAT traversal)
- [ ] Sistema de salas/interesses
- [ ] Filtros de vídeo e efeitos
- [ ] Compartilhamento de tela
- [ ] Gravação de chamadas (com consentimento)
- [ ] Moderação automática por IA
- [ ] Histórico de conversas (opcional)
- [ ] Sistema de denúncias
- [ ] Interface mobile melhorada
- [ ] Suporte a emojis e GIFs
- [ ] Tradução automática
- [ ] Estatísticas de uso
- [ ] Qualidade adaptativa de vídeo

## 🐛 Troubleshooting

**Erro: "Cannot find module 'express'"**

- Solução: Execute `npm install`

**Porta 3000 já em uso**

- Solução: Mude a porta no `server.js`: `const PORT = 3001;`

**Conexão não estabelecida**

- Verifique se o servidor está rodando
- Abra o console do navegador (F12) para ver erros
- Certifique-se de que o firewall não está bloqueando

**Vídeo/Áudio não funciona**

- Verifique permissões do navegador para câmera/microfone
- Teste em `chrome://settings/content/camera` e `chrome://settings/content/microphone`
- Certifique-se de estar em localhost ou HTTPS
- Teste em outro navegador (Chrome recomendado)
- Verifique se outra aplicação não está usando a câmera

**Vídeo congela ou trava**

- Problema comum com firewall/NAT restritivo
- Solução: Configure TURN server (ver seção abaixo)
- Teste na mesma rede local primeiro

**"NotAllowedError" ou "PermissionDeniedError"**

- Usuário negou acesso à câmera/microfone
- Instrua para permitir nas configurações do navegador

### 🔧 Configurar TURN Server (Avançado)

Para produção, você precisa de um TURN server para usuários atrás de NATs restritivos:

```javascript
// No cliente (index.html), substitua rtcConfig por:
const rtcConfig = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    {
      urls: "turn:seu-servidor.com:3478",
      username: "usuario",
      credential: "senha",
    },
  ],
};
```

**Opções de TURN Server:**

- **coturn** (self-hosted, grátis)
- **Twilio TURN** (pago, confiável)
- **Xirsys** (pago, fácil)
- **Metered.ca** (50GB grátis/mês)

## 📜 Licença

MIT - Sinta-se livre para usar e modificar!

## 🤝 Contribuindo

Sugestões e melhorias são bem-vindas! Este é um projeto educacional.

---

**Divirta-se conversando! 💬🌍**
