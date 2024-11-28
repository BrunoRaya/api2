import express from 'express'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const router = express.Router()

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
    
        console.log("Usuário criado no banco:", professionalDB);
        res.status(201).json(professionalDB);
    } catch (error) {
      console.error("Erro ao criar usuário:", {
          message: error.message,
          stack: error.stack,
          details: error
      });
      res.status(500).json({ message: "Erro no servidor, tente novamente!", error: error.message });
  }
  
})

export default router

