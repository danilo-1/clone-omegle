# Use Node.js LTS
FROM node:18-alpine

# Criar diretório da aplicação
WORKDIR /usr/src/app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install --only=production

# Copiar código da aplicação
COPY . .

# Expor porta (Render usa a variável PORT)
EXPOSE 3000

# Iniciar aplicação
CMD [ "node", "server.js" ]