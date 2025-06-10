import AppError from '../../hiago/utils/AppError.js';
import pool from '../../config.js';

async function validarCliente(cpf, email) {
  const cpfLimpo = cpf.replace(/\D/g, ''); // Remove pontos e hífen
  const cpfRegex = /^\d{11}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!cpfRegex.test(cpfLimpo)) {
    return new AppError('CPF inválido. Deve conter 11 dígitos numéricos.', 400, 'INVALID_CPF');
  }

  if (!emailRegex.test(email)) {
    return new AppError('Email inválido.', 400, 'INVALID_EMAIL');
  }

  try {
    const conexao = await pool.getConnection();

    const [cpfExistente] = await conexao.execute('SELECT id FROM cliente WHERE cpf = ?', [cpfLimpo]);
    const [emailExistente] = await conexao.execute('SELECT id FROM cliente WHERE email = ?', [email]);

    conexao.release();

    if (cpfExistente.length > 0) {
      return new AppError('Já existe um cliente com este CPF.', 400, 'CPF_DUPLICADO');
    }

    if (emailExistente.length > 0) {
      return new AppError('Já existe um cliente com este email.', 400, 'EMAIL_DUPLICADO');
    }

    return null;

  } catch (erro) {
    return new AppError('Erro ao validar cliente.', 500, 'VALIDATION_ERROR', erro.message);
  }
}

export default validarCliente;
