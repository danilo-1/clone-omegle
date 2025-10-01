const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;

// Servir arquivos estáticos
app.use(express.static('public'));

// Fila de usuários esperando por conexão
let waitingUsers = [];
// Mapa de conexões ativas: socketId -> partnerId
let activeConnections = new Map();
// Armazenar preferências de modo (text, audio, video)
let userModes = new Map();

io.on('connection', (socket) => {
    console.log(`Novo usuário conectado: ${socket.id}`);

    // Usuário procura por parceiro com modo específico
    socket.on('find-partner', (data) => {
        const mode = data.mode || 'text'; // text, audio, video
        console.log(`${socket.id} está procurando parceiro em modo: ${mode}`);
        
        userModes.set(socket.id, mode);

        // Procurar alguém com o mesmo modo
        const matchingUserIndex = waitingUsers.findIndex(userId => {
            const userMode = userModes.get(userId);
            return userMode === mode;
        });

        if (matchingUserIndex > -1) {
            const partnerId = waitingUsers.splice(matchingUserIndex, 1)[0];
            const partnerSocket = io.sockets.sockets.get(partnerId);

            // Verificar se o parceiro ainda está conectado
            if (partnerSocket) {
                // Estabelecer conexão
                activeConnections.set(socket.id, partnerId);
                activeConnections.set(partnerId, socket.id);

                // Notificar ambos
                socket.emit('partner-found', { partnerId, mode });
                partnerSocket.emit('partner-found', { partnerId: socket.id, mode });

                console.log(`Conectados (${mode}): ${socket.id} <-> ${partnerId}`);
            } else {
                // Parceiro desconectou, adicionar usuário atual à fila
                waitingUsers.push(socket.id);
                socket.emit('searching');
            }
        } else {
            // Adicionar à fila de espera
            waitingUsers.push(socket.id);
            socket.emit('searching');
            console.log(`${socket.id} adicionado à fila (${mode}). Total na fila: ${waitingUsers.length}`);
        }
    });

    // WebRTC Signaling - Offer
    socket.on('webrtc-offer', (data) => {
        const partnerId = activeConnections.get(socket.id);
        if (partnerId) {
            const partnerSocket = io.sockets.sockets.get(partnerId);
            if (partnerSocket) {
                partnerSocket.emit('webrtc-offer', {
                    offer: data.offer,
                    from: socket.id
                });
                console.log(`WebRTC offer de ${socket.id} para ${partnerId}`);
            }
        }
    });

    // WebRTC Signaling - Answer
    socket.on('webrtc-answer', (data) => {
        const partnerId = activeConnections.get(socket.id);
        if (partnerId) {
            const partnerSocket = io.sockets.sockets.get(partnerId);
            if (partnerSocket) {
                partnerSocket.emit('webrtc-answer', {
                    answer: data.answer,
                    from: socket.id
                });
                console.log(`WebRTC answer de ${socket.id} para ${partnerId}`);
            }
        }
    });

    // WebRTC Signaling - ICE Candidate
    socket.on('webrtc-ice-candidate', (data) => {
        const partnerId = activeConnections.get(socket.id);
        if (partnerId) {
            const partnerSocket = io.sockets.sockets.get(partnerId);
            if (partnerSocket) {
                partnerSocket.emit('webrtc-ice-candidate', {
                    candidate: data.candidate,
                    from: socket.id
                });
            }
        }
    });

    // Enviar mensagem de texto ao parceiro
    socket.on('send-message', (data) => {
        const partnerId = activeConnections.get(socket.id);
        if (partnerId) {
            const partnerSocket = io.sockets.sockets.get(partnerId);
            if (partnerSocket) {
                partnerSocket.emit('receive-message', {
                    message: data.message,
                    timestamp: Date.now()
                });
                console.log(`Mensagem de ${socket.id} para ${partnerId}`);
            }
        }
    });

    // Usuário está digitando
    socket.on('typing', () => {
        const partnerId = activeConnections.get(socket.id);
        if (partnerId) {
            const partnerSocket = io.sockets.sockets.get(partnerId);
            if (partnerSocket) {
                partnerSocket.emit('partner-typing');
            }
        }
    });

    // Usuário parou de digitar
    socket.on('stop-typing', () => {
        const partnerId = activeConnections.get(socket.id);
        if (partnerId) {
            const partnerSocket = io.sockets.sockets.get(partnerId);
            if (partnerSocket) {
                partnerSocket.emit('partner-stop-typing');
            }
        }
    });

    // Toggle de vídeo/áudio
    socket.on('media-toggle', (data) => {
        const partnerId = activeConnections.get(socket.id);
        if (partnerId) {
            const partnerSocket = io.sockets.sockets.get(partnerId);
            if (partnerSocket) {
                partnerSocket.emit('partner-media-toggle', data);
            }
        }
    });

    // Desconectar do chat atual
    socket.on('disconnect-chat', () => {
        handleDisconnection(socket, false);
    });

    // Desconexão total
    socket.on('disconnect', () => {
        console.log(`Usuário desconectou: ${socket.id}`);
        handleDisconnection(socket, true);
    });

    function handleDisconnection(socket, fullDisconnect) {
        // Remover da fila se estiver esperando
        const waitingIndex = waitingUsers.indexOf(socket.id);
        if (waitingIndex > -1) {
            waitingUsers.splice(waitingIndex, 1);
            console.log(`${socket.id} removido da fila`);
        }

        // Notificar parceiro se conectado
        const partnerId = activeConnections.get(socket.id);
        if (partnerId) {
            const partnerSocket = io.sockets.sockets.get(partnerId);
            if (partnerSocket) {
                partnerSocket.emit('partner-disconnected');
                console.log(`${partnerId} notificado sobre desconexão de ${socket.id}`);
            }
            // Remover conexões
            activeConnections.delete(socket.id);
            activeConnections.delete(partnerId);
        }

        // Limpar modo do usuário
        userModes.delete(socket.id);

        if (!fullDisconnect) {
            socket.emit('disconnected');
        }
    }
});

server.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║   🚀 Servidor Chat Omegle Iniciado    ║
║      📹 Com Vídeo e Áudio 🎤          ║
╠════════════════════════════════════════╣
║  Acesse: http://localhost:${PORT}        ║
║  Pressione Ctrl+C para parar          ║
╚════════════════════════════════════════╝
    `);
    console.log(`Aguardando conexões...\n`);
});