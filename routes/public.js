import express from 'express'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const router = express.Router()

router.post('/cadastroProfissional', async (req, res) => {
    
    try {
        console.log("Dados recebidos:", req.body);
    
        const user = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(user.password, salt);
    
        const userDB = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              profession: user.profession,
              address: {
                set: user.address,
              },
              cep: user.cep,
              complemento: user.complemento,
              cpf: user.cpf,
              password: hashPassword,
            },
          });
    
        console.log("Usuário criado no banco:", userDB);
        res.status(201).json(userDB);
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

