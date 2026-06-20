#imagen liviana de node
FROM node:20-alpine

#carpeta de trabajo
WORKDIR /usr/src/app

#Habilitamos pnpm adentro del contenedor antes de instalar nada
RUN npm install -g pnpm

# Realizamos una copia del archivo con los módulos/dependencias y el lock de pnpm
COPY package*.json pnpm-lock.yaml ./

# Se instalan las librerias usando pnpm
RUN pnpm install

# Copiamos todo el código de la API al entorno de Docker
COPY . .

# Puerto
ENV PORT=3000
EXPOSE ${PORT}

# Qué se ejecuta en el arranque (mejor ejecutar node directo)
CMD ["npx", "ts-node", "app.js"]