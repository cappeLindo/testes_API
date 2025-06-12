import pool from '../../../config.js';
import AppError from '../../utils/AppError.js';

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

async function apresentarCategoria(req, res, next) {
  const sql = `SELECT * FROM categoria`;
  try {
    const resultado = await executarQuery(sql);
    return resultado;
  } catch (error) {
    if (!(error instanceof AppError)) {
      throw new AppError('Erro ao apresentar categoria', 500, 'CATEGORIA_LIST_ERROR', error.message);
    }
    throw error;
  }
}

async function apresentarCategoriaPorId(id) {
  if (!id) {
    throw new AppError('ID da categoria é obrigatório', 400, 'MISSING_ID');
  }

  const sql = `SELECT * FROM categoria WHERE id = ?`;
  try {
    const resultado = await executarQuery(sql, [id]);

    return resultado;
  } catch (error) {
    if (!(error instanceof AppError)) {
      throw new AppError('Erro ao buscar categoria por ID', 500, 'CATEGORIA_ID_ERROR', error.message);
    }
    throw error;
  }
}

async function apresentarCategoriaPorNome(nome) {
  if (!nome) {
    throw new AppError('Nome da categoria é obrigatório', 400, 'MISSING_NAME');
  }

  const sql = `SELECT * FROM categoria WHERE nome LIKE ?`;
  try {
    const resultado = await executarQuery(sql, [`%${nome}%`]);

    return resultado;
  } catch (error) {
    if (!(error instanceof AppError)) {
      throw new AppError('Erro ao buscar categoria por nome', 500, 'CATEGORIA_NAME_ERROR', error.message);
    }
    throw error;
  }
}

export { apresentarCategoria, apresentarCategoriaPorId, apresentarCategoriaPorNome };
