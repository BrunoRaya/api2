import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import publicRouter from './routes/public.js';

dotenv.config();

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Conectado ao MongoDB');
}).catch((error) => {
  console.error('Erro ao conectar ao MongoDB:', error);
});

const app = express();
app.use(express.json()); 

app.use('/api', publicRouter);

const port = process.env.PORT || 4100;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
