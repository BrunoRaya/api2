import express from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // Adiciona logs para depuração
});
const router = express.Router();

// Teste de conexão com o modelo Professional
(async () => {
  try {
    console.log("Tentando buscar profissionais...");
    const testProfessional = await prisma.professional.findMany();
    console.log("Profissionais encontrados:", testProfessional);
  } catch (error) {
    console.error("Erro ao buscar profissionais:", {
      message: error.message,
      stack: error.stack,
      details: error,
    });
  }
})();


router.post('/cadastroProfissional', async (req, res) => {
  try {
    console.log("Dados recebidos:", req.body);

    const professional = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(professional.password, salt);

    const professionalDB = await prisma.professional.create({
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

    console.log("Profissional criado no banco:", professionalDB);
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
