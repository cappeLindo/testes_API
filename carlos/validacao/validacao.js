import AppError from '../utils/appError.js';
import pool from '../../config.js';

async function validarConcessionaria(req, res, next) {
  const { nome_concessionaria, cnpj_concessionaria, email_concessionaria, telefone_concessionaria, endereco_id_endereco } = req.body;

  const cnpjRegex = /^\d{14}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!nome_concessionaria) {
    return next(new AppError('Nome da concessionária é obrigatório.', 400, 'INVALID_NOME'));
  }

  if (!cnpjRegex.test(cnpj_concessionaria)) {
    return next(new AppError('CNPJ inválido. Deve conter 14 dígitos numéricos.', 400, 'INVALID_CNPJ'));
  }

  if (!emailRegex.test(email_concessionaria)) {
    return next(new AppError('Email inválido.', 400, 'INVALID_EMAIL'));
  }

  if (!telefone_concessionaria) {
    return next(new AppError('Telefone é obrigatório.', 400, 'INVALID_TELEFONE'));
  }

  if (!endereco_id_endereco || isNaN(endereco_id_endereco)) {
    return next(new AppError('ID do endereço inválido.', 400, 'INVALID_ENDERECO_ID'));
  }

  try {
    const conexao = await pool.getConnection();

    const [cnpjExistente] = await conexao.execute('SELECT id_concessionaria FROM concessionaria WHERE cnpj_concessionaria = ?', [cnpj_concessionaria]);
    const [emailExistente] = await conexao.execute('SELECT id_concessionaria FROM concessionaria WHERE email_concessionaria = ?', [email_concessionaria]);
    const [enderecoExistente] = await conexao.execute('SELECT id_endereco FROM endereco WHERE id_endereco = ?', [endereco_id_endereco]);

    conexao.release();

    if (cnpjExistente.length > 0) {
      return next(new AppError('Já existe uma concessionária com este CNPJ.', 400, 'CNPJ_DUPLICADO'));
    }

    if (emailExistente.length > 0) {
      return next(new AppError('Já existe uma concessionária com este email.', 400, 'EMAIL_DUPLICADO'));
    }

    if (enderecoExistente.length === 0) {
      return next(new AppError('Endereço não encontrado.', 400, 'ENDERECO_NAO_ENCONTRADO'));
    }

    next();
  } catch (erro) {
    next(new AppError('Erro ao validar concessionária.', 500, 'VALIDATION_ERROR', erro.message));
  }
}

export default validarConcessionaria;