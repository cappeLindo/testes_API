import pool from '../../../config.js';
import AppError from '../../utils/appError.js';

async function executarQuery(sql, params = []) {
  let conexao;
  try {
    conexao = await pool.getConnection();
    const [resultado] = await conexao.execute(sql, params);
    return resultado;
  } catch (error) {
    throw new AppError('Erro ao executar o comando', 500, 'DB_EXEC_ERROR', error.message);
  } finally {
    if (conexao) conexao.release();
  }
}

async function apresentarConcessionaria() {
  try {
    const sql = `
      SELECT c.id, c.nome, c.cnpj, c.email, c.senha, c.telefone,
             e.estado, e.cidade, e.bairro, e.rua, e.numero, e.cep
      FROM concessionaria c
      JOIN endereco e ON c.endereco_id = e.id
    `;
    const resultado = await executarQuery(sql);
    return resultado;
  } catch (error) {
    throw new AppError('Erro ao listar concessionárias', 500, 'CONCESSIONARIA_LIST_ERROR', error.message);
  }
}

async function apresentarConcessionariaPorId(id) {
  if (!id || isNaN(id)) {
    throw new AppError('ID da concessionária é obrigatório e deve ser um número válido', 400, 'INVALID_ID');
  }

  try {
    const sql = `
      SELECT c.id, c.nome, c.cnpj, c.email, c.senha, c.telefone,
             e.estado, e.cidade, e.bairro, e.rua, e.numero, e.cep
      FROM concessionaria c
      JOIN endereco e ON c.endereco_id = e.id
      WHERE c.id = ?
    `;
    const resultado = await executarQuery(sql, [parseInt(id, 10)]);
    return resultado;
  } catch (error) {
    throw new AppError('Erro ao buscar concessionária por ID', 500, 'CONCESSIONARIA_ID_ERROR', error.message);
  }
}

async function apresentarConcessionariaPorEmail(email) {
  if (!email) {
    throw new AppError('Email da concessionária é obrigatório', 400, 'MISSING_EMAIL');
  }

  try {
    const sql = `
      SELECT c.id, c.nome, c.cnpj, c.email, c.senha, c.telefone,
             e.estado, e.cidade, e.bairro, e.rua, e.numero, e.cep
      FROM concessionaria c
      JOIN endereco e ON c.endereco_id = e.id
      WHERE c.email LIKE ?
    `;
    const resultado = await executarQuery(sql, [`%${email}%`]);
    return resultado;
  } catch (error) {
    throw new AppError('Erro ao buscar concessionária por email', 500, 'CONCESSIONARIA_EMAIL_ERROR', error.message);
  }
}

async function apresentarConcessionariaPorNome(nome) {
  if (!nome) {
    throw new AppError('Nome da concessionária é obrigatório', 400, 'MISSING_NAME');
  }

  try {
    const sql = `
      SELECT c.id, c.nome, c.cnpj, c.email, c.senha, c.telefone,
             e.estado, e.cidade, e.bairro, e.rua, e.numero, e.cep
      FROM concessionaria c
      JOIN endereco e ON c.endereco_id = e.id
      WHERE c.nome LIKE ?
    `;
    const resultado = await executarQuery(sql, [`%${nome}%`]);
    return resultado;
  } catch (error) {
    throw new AppError('Erro ao buscar concessionária por nome', 500, 'CONCESSIONARIA_NAME_ERROR', error.message);
  }
}

async function apresentarFotoConcessionariaPorId(id) {
  if (!id || isNaN(id)) {
    throw new AppError('ID da concessionária é obrigatório e deve ser um número válido', 400, 'INVALID_ID');
  }

  try {
    const sql = `SELECT imagem FROM concessionaria WHERE id = ?`;
    const resultado = await executarQuery(sql, [parseInt(id, 10)]);
    return resultado;
  } catch (error) {
    throw new AppError('Erro ao buscar imagem da concessionária', 500, 'CONCESSIONARIA_IMAGE_ERROR', error.message);
  }
}

export {
  apresentarConcessionaria,
  apresentarConcessionariaPorId,
  apresentarConcessionariaPorEmail,
  apresentarConcessionariaPorNome,
  apresentarFotoConcessionariaPorId
};
