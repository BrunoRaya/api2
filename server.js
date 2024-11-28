import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import publico from './routes/public.js';

// Carregar variáveis de ambiente
dotenv.config();

// Criar a instância do express
const app = express();

// Criar a instância do Prisma
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL 
    }
  }
});

// Usar o middleware para analisar o corpo da requisição como JSON
app.use(express.json());

// Definir a rota para /api
app.use('/api', publico);

// Definir a porta
const port = process.env.PORT || 4000;

// Iniciar o servidor na porta definida
app.listen(port, () => console.log(`Server running on port ${port}`));
