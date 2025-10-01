# 🐛 Guia de Debug - WebRTC Vídeo/Áudio

## 🔍 O que foi corrigido:

### 1. **Recepção de Tracks Remotos**
- Agora usa `event.streams[0]` diretamente quando disponível
- Melhora compatibilidade entre navegadores
- Logs mais detalhados para debug

### 2. **Ordem de Signaling**
- Adicionado delay de 500ms para garantir que ambos tenham mídia pronta
- Melhor tratamento de erros em cada etapa
- Logs em cada passo do processo WebRTC

### 3. **Ofertas WebRTC**
- Adicionado `offerToReceiveAudio: true`
- Adicionado `offerToReceiveVideo: true` (quando modo vídeo)
- Força a negociação correta de mídia

### 4. **Estados de Conexão**
- Monitoramento de `connectionState`
- Monitoramento de `iceConnectionState`
- Mensagens do sistema para feedback visual

---

## 🧪 Como Testar:

### 1. Abra o Console (F12) em Ambas as Janelas

Você deve ver logs assim:

```
Iniciando modo: video
Criando conexão peer
Adicionando track local: video
Adicionando track local: audio
Criando oferta WebRTC
Oferta enviada
Enviando ICE candidate
Connection state: connecting
ICE Connection state: checking
Track recebido: video
Track recebido: audio
Stream remoto conectado
Connection state: connected
🎥 Vídeo/Áudio conectado!
```

### 2. Verifique se os Vídeos Aparecem

**Janela 1 (Você):**
- Vídeo local deve aparecer à esquerda
- Vídeo remoto (estranho) deve aparecer à direita

**Janela 2 (Estranho):**
- Vídeo local deve aparecer à esquerda
- Vídeo remoto (você) deve aparecer à direita

---

## ❌ Problemas Comuns e Soluções:

### Problema 1: "Track recebido" mas vídeo não aparece

**Diagnóstico:**
Abra console e digite:
```javascript
document.getElementById('remoteVideo').srcObject
```

**Se retornar `null`:**
- A stream não está sendo atribuída corretamente
- Verifique se ambos permitiram câmera/microfone

**Solução:**
Recarregue ambas as páginas e tente novamente

---

### Problema 2: ICE Connection fica em "checking" indefinidamente

**Causa:** Firewall ou NAT bloqueando a conexão P2P

**Diagnóstico:**
No console, digite:
```javascript
// Janela 1
peerConnection.iceConnectionState
// Deve mostrar: "connected"

// Se mostrar "failed" ou "checking":
peerConnection.getStats().then(stats => {
    stats.forEach(report => {
        if (report.type === 'candidate-pair') {
            console.log('Candidate pair:', report);
        }
    });
});
```

**Solução:**
1. Teste em localhost primeiro
2. Use HTTPS em produção
3. Configure TURN server (ver abaixo)

---

### Problema 3: Áudio funciona mas vídeo não

**Causa:** Navegador não suporta resolução solicitada

**Solução:**
Reduza a resolução no código:
```javascript
// Em initializeMedia(), linha ~280
video: mode === 'video' ? { 
    width: { ideal: 1280 }, 
    height: { ideal: 720 },
    facingMode: 'user'
} : false
```

---

### Problema 4: "NotAllowedError: Permission denied"

**Causa:** Usuário negou permissão ou site não está em HTTPS

**Solução:**
1. Em **localhost**: Funciona sem HTTPS
2. Em **produção**: HTTPS é obrigatório
3. Instruir usuário a permitir nas configurações do navegador

Chrome: `chrome://settings/content/camera`

---

## 🔧 Comandos de Debug Úteis

Cole no console do navegador (F12):

### Ver estado da conexão:
```javascript
console.log('Connection:', peerConnection.connectionState);
console.log('ICE:', peerConnection.iceConnectionState);
console.log('Signaling:', peerConnection.signalingState);
```

### Ver tracks locais:
```javascript
localStream.getTracks().forEach(track => {
    console.log(track.kind, track.enabled, track.readyState);
});
```

### Ver tracks remotos:
```javascript
if (remoteVideo.srcObject) {
    remoteVideo.srcObject.getTracks().forEach(track => {
        console.log(track.kind, track.enabled, track.readyState);
    });
}
```

### Ver estatísticas detalhadas:
```javascript
peerConnection.getStats().then(stats => {
    stats.forEach(report => {
        console.log(report.type, report);
    });
});
```

### Forçar reconexão:
```javascript
// Se tudo falhar, force uma nova tentativa
stopChat();
setTimeout(() => {
    selectMode('video');
    startNewChat();
}, 1000);
```

---

## 🌐 Testando em Diferentes Cenários

### Cenário 1: Mesma Máquina (Localhost)
✅ Deve funcionar perfeitamente
- Abra 2 janelas/abas
- Ambas em `http://localhost:3000`

### Cenário 2: Mesma Rede Local
✅ Deve funcionar perfeitamente
- Dispositivo A: Navegador 1
- Dispositivo B: Navegador 2
- Ambos na mesma WiFi

### Cenário 3: Redes Diferentes (Internet)
⚠️ Pode precisar de TURN server
- **Com STUN apenas:** ~80% funciona
- **Com TURN:** 99% funciona
- Veja seção de TURN abaixo

---

## 🔐 Configurar TURN Server (Para Produção)

Se vídeo não funciona em redes diferentes, adicione TURN:

### Opção 1: Metered.ca (50GB grátis/mês)

1. Cadastre em https://www.metered.ca/
2. Pegue suas credenciais
3. Atualize `rtcConfig`:

```javascript
const rtcConfig = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        {
            urls: 'turn:a.relay.metered.ca:80',
            username: 'SEU_USERNAME',
            credential: 'SUA_CREDENTIAL'
        },
        {
            urls: 'turn:a.relay.metered.ca:443',
            username: 'SEU_USERNAME',
            credential: 'SUA_CREDENTIAL'
        }
    ]
};
```

### Opção 2: Twilio (Pago, mas muito confiável)

```javascript
// Requer backend para gerar tokens
// Ver: https://www.twilio.com/docs/stun-turn
```

### Opção 3: Self-hosted coturn (Grátis)

Requer servidor VPS próprio.

---

## 📊 Checklist de Verificação

Antes de reportar bug, confirme:

- [ ] **Ambos permitiram câmera/microfone** quando solicitado
- [ ] **Site está em HTTPS** (ou localhost)
- [ ] **Console não mostra erros** em vermelho
- [ ] **Logs mostram "Track recebido"** em ambas as janelas
- [ ] **Connection state: connected** em ambos
- [ ] **Navegador atualizado** (Chrome/Firefox/Safari recente)
- [ ] **Testou em navegador diferente** para isolar problema
- [ ] **Testou em localhost** primeiro

---

## 🆘 Se Ainda Não Funcionar

1. **Abra console em AMBAS as janelas**
2. **Copie TODOS os logs**
3. **Tire screenshot de ambas as telas**
4. **Me envie:**
   - Logs completos
   - Screenshots
   - Navegador e versão
   - Cenário de teste (localhost? produção? mesma rede?)

Com essas informações posso identificar o problema exato! 🔍

---

## ✅ Teste Rápido

Execute este código no console de ambas as janelas após conectar:

```javascript
// Deve retornar TRUE em ambos
console.log('Local video playing?', !localVideo.paused);
console.log('Remote video playing?', !remoteVideo.paused);
console.log('Connection?', peerConnection?.connectionState);
console.log('Remote tracks?', remoteVideo.srcObject?.getTracks().length);
```

Se todos retornarem valores positivos, o WebRTC está funcionando! 🎉