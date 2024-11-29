import express from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { MongoClient } from 'mongodb'; // Adicionando a importação do MongoClient

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // Adiciona logs para depuração
});
const router = express.Router();

// Teste de conexão com o MongoDB diretamente (não usando o Prisma)
const client = new MongoClient(process.env.DATABASE_URL);

(async () => {
  try {
    console.log("Tentando conectar diretamente ao MongoDB...");
    await client.connect();
    const db = client.db(); // Nome do banco definido no MongoDB
    const professionals = db.collection("Professional");
    
    // Verifica e imprime todos os profissionais na coleção
    const professionalsList = await professionals.find({}).toArray();
    console.log("Profissionais encontrados no MongoDB diretamente:", professionalsList);
  } catch (error) {
    console.error("Erro ao buscar profissionais diretamente no MongoDB:", error);
  }
})();

router.post('/cadastroProfissional', async (req, res) => {
  try {
    console.log("Dados recebidos:", req.body);

    const professional = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(professional.password, salt);

    const professionalDB = await prisma.Professional.create({
      data: {
        email: professional.email,
        name: professional.name,
        profession: professional.profession,
        address: {
          set: professional.address,
        },
        cep: professional.cep,
        complemento: professional.complemento,
        cpf: professional.cpf,
        password: hashPassword,
      },
    });

    console.log("Profissional criado no banco via Prisma:", professionalDB);
    res.status(201).json(professionalDB);
  } catch (error) {
    console.error("Erro ao criar profissional:", {
      message: error.message,
      stack: error.stack,
      details: error,
    });
    res.status(500).json({ message: "Erro no servidor, tente novamente!", error: error.message });
  }
});

export default router;
