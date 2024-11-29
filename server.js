import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import publicRouter from './routes/public.js';

// Carregar as variáveis de ambiente
dotenv.config();

// Conectar ao MongoDB
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Conectado ao MongoDB');
}).catch((error) => {
  console.error('Erro ao conectar ao MongoDB:', error);
});

// Configurar o servidor Express
const app = express();
app.use(express.json()); // Para processar o corpo das requisições em JSON

// Usar as rotas
app.use('/api', publicRouter);

// Iniciar o servidor
const port = process.env.PORT || 4100;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
