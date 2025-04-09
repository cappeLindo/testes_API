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

async function apresentarCor(req, res, next) {
  const sql = `SELECT * FROM cor`;
  try {
    const resultado = await executarQuery(sql);
    return resultado;
  } catch (error) {
    if (!(error instanceof AppError)) {
      throw new AppError('Erro ao apresentar cor', 500, 'COR_LIST_ERROR', error.message);
    }
    throw error;
  }
}

async function apresentarCorPorId(id) {
  if (!id) {
    throw new AppError('ID da cor é obrigatório', 400, 'MISSING_ID');
  }

  const sql = `SELECT * FROM cor WHERE id_cor = ?`;
  try {
    const resultado = await executarQuery(sql, [id]);

    return resultado;
  } catch (error) {
    if (!(error instanceof AppError)) {
      throw new AppError('Erro ao buscar cor por ID', 500, 'COR_ID_ERROR', error.message);
    }
    throw error;
  }
}

async function apresentarCorPorNome(nome) {
  if (!nome) {
    throw new AppError('Nome da cor é obrigatório', 400, 'MISSING_NAME');
  }

  const sql = `SELECT * FROM cor WHERE nome_cor LIKE ?`;
  try {
    const resultado = await executarQuery(sql, [`%${nome}%`]);

    return resultado;
  } catch (error) {
    if (!(error instanceof AppError)) {
      throw new AppError('Erro ao buscar cor por nome', 500, 'COR_NAME_ERROR', error.message);
    }
    throw error;
  }
}

export { apresentarCor, apresentarCorPorId, apresentarCorPorNome };
