import express from 'express';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

// Definir o modelo Professional com Mongoose
const professionalSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  name: String,
  profession: String,
  address: {
    street: String,
    city: String,
    state: String,
  },
  cep: String,
  complemento: String,
  cpf: { type: String, unique: true },
  password: String,
})

const Professional = mongoose.model('Professional', professionalSchema);

const router = express.Router();

router.post('/cadastroProfissional', async (req, res) => {
  try {
    console.log("Dados recebidos:", req.body);

    const professional = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(professional.password, salt);

    // Criação do novo profissional no banco de dados
    const newProfessional = new Professional({
      email: professional.email,
      name: professional.name,
      profession: professional.profession,
      address: professional.address,
      cep: professional.cep,
      complemento: professional.complemento,
      cpf: professional.cpf,
      password: hashPassword,
    });

    // Salvar o profissional no banco de dados
    const savedProfessional = await newProfessional.save();

    console.log("Profissional criado no banco:", savedProfessional);
    res.status(201).json(savedProfessional);
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
