

# Gunakan image Node.js
FROM node:18-alpine

# Set Working Directory
WORKDIR /app

# Copy package.json & package-lock.json dulu
COPY package*.json ./

# Install Dependencies
RUN npm install

# Copy Semua File Project
COPY . .

# Build Vue
RUN npm run build

# Expose Port Vue (biasanya 5173 atau 8080 kalau Vite)
EXPOSE 3000

# Jalankan aplikasi
CMD ["npm", "run", "dev"]

