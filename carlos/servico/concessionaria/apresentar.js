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

async function apresentarConcessionaria(id = null) {
  const sql = id ? `SELECT id, nome, email, cnpj, senha, telefone FROM Concessionaria WHERE id = ?` : `SELECT id, nome, email, cnpj, senha, telefone FROM Concessionaria`;
  const params = id ? [id] : [];

  const resultado = await executarQuery(sql, params);

  if (!resultado || resultado.length === 0) {
    throw new AppError(id ? 'Concessionaria não encontrado.' : 'Nenhum concessionaria encontrada.', 404, id ? 'CONCESSIONARIA_NAO_ENCONTRADO' : 'CONCESSIONARIAS_NAO_ENCONTRADOS');
  }

  return resultado;
}

async function apresentarConcessionariaPorEmail(email) {
  const sql = `SELECT id, nome, email, cnpj, senha, telefone FROM concessionaria WHERE email LIKE ?`;

  const resultado = await executarQuery(sql, [`%${email}%`]);

  if (!resultado || resultado.length === 0) {
    throw new AppError(email ? 'Concessionaria não encontrada.' : 'Nenhum concessionaria encontrada.', 404, email ? 'CONCESSIONARIA_NAO_ENCONTRADO' : 'CONCESSIONARIAS_NAO_ENCONTRADOS');
  }

  return resultado;
}

async function apresentarConcessionariaPorNome(nome) {
  const sql = `SELECT id, nome, email, cnpj, senha, telefone FROM concessionaria WHERE nome LIKE ?`;

  const resultado = await executarQuery(sql, [`%${nome}%`]);

  if (!resultado || resultado.length === 0) {
    throw new AppError(nome ? 'Concessionaria não encontrado.' : 'Nenhum Concessionaria encontrado.', 404, nome ? 'CONCESSIONARIA_NAO_ENCONTRADO' : 'CONCESSIONARIAS_NAO_ENCONTRADOS');
  }

  return resultado;
}

async function apresentarFotoConcessionariaPorId(id) {
  const sql = `SELECT imagem FROM concessionaria WHERE id = ?`;
  const params = [id];

  const resultado = await executarQuery(sql, params);

  if (!resultado || resultado.length === 0) {
    throw new AppError(id ? 'Concessionaria não encontrado.' : 'Nenhum Concessionaria encontrado.', 404, id ? 'CONCESSIONARIA_NAO_ENCONTRADO' : 'CONCESSIONARIAS_NAO_ENCONTRADOS');
  }

  return resultado;
}

export { apresentarConcessionaria, apresentarConcessionariaPorEmail, apresentarConcessionariaPorNome, apresentarFotoConcessionariaPorId }