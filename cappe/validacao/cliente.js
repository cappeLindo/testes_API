import AppError from '../../hiago/utils/AppError.js';
import pool from '../../config.js';

async function validarCliente(req, res, next) {
  const { nome_cliente, cpf_cliente, email_cliente, telefone_cliente } = req.body;

  const cpfRegex = /^\d{11}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!cpfRegex.test(cpf_cliente)) {
    return next(new AppError('CPF inválido. Deve conter 11 dígitos numéricos.', 400, 'INVALID_CPF'));
  }

  if (!emailRegex.test(email_cliente)) {
    return next(new AppError('Email inválido.', 400, 'INVALID_EMAIL'));
  }

  try {
    const conexao = await pool.getConnection();

    const [cpfExistente] = await conexao.execute('SELECT id_cliente FROM cliente WHERE cpf_cliente = ?', [cpf_cliente]);
    const [emailExistente] = await conexao.execute('SELECT id_cliente FROM cliente WHERE email_cliente = ?', [email_cliente]);

    conexao.release();

    if (cpfExistente.length > 0) {
      return next(new AppError('Já existe um cliente com este CPF.', 400, 'CPF_DUPLICADO'));
    }

    if (emailExistente.length > 0) {
      return next(new AppError('Já existe um cliente com este email.', 400, 'EMAIL_DUPLICADO'));
    }

    next();
  } catch (erro) {
    next(new AppError('Erro ao validar cliente.', 500, 'VALIDATION_ERROR', erro.message));
  }
}

export default validarCliente;