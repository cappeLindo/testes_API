import AppError from '../../hiago/utils/AppError.js';
import pool from '../../config.js';

export async function validarConcessionaria(cnpj, email) {
  const cnpjLimpo = cnpj.replace(/\D/g, ''); // Remove pontos e barras
  const cnpjRegex = /^\d{14}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!cnpjRegex.test(cnpjLimpo)) {
    return new AppError('CNPJ inválido. Deve conter 14 dígitos numéricos.', 400, 'INVALID_CNPJ');
  }

  if (!emailRegex.test(email)) {
    return new AppError('Email inválido.', 400, 'INVALID_EMAIL');
  }

  try {
    const conexao = await pool.getConnection();

    const [cnpjExistente] = await conexao.execute('SELECT id FROM concessionaria WHERE cnpj = ?', [cnpjLimpo]);
    const [emailExistente] = await conexao.execute('SELECT id FROM concessionaria WHERE email = ?', [email]);

    conexao.release();

    if (cnpjExistente.length > 0) {
      return new AppError('Já existe uma concessionária com este CNPJ.', 400, 'CNPJ_DUPLICADO');
    }

    if (emailExistente.length > 0) {
      return new AppError('Já existe uma concessionária com este email.', 400, 'EMAIL_DUPLICADO');
    }

    return null;

  } catch (erro) {
    return new AppError('Erro ao validar concessionária.', 500, 'VALIDATION_ERROR', erro.message);
  }
}

export default validarConcessionaria;
