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

async function apresentarAro(req, res, next) {
  const sql = `SELECT * FROM aro`;
  try {
    const resultado = await executarQuery(sql);
    return resultado;
  } catch (error) {
    if (!(error instanceof AppError)) {
      throw new AppError('Erro ao apresentar aro', 500, 'ARO_LIST_ERROR', error.message);
    }
    throw error;
  }
}

async function apresentarAroPorId(id) {
  if (!id) {
    throw new AppError('ID do aro é obrigatório', 400, 'MISSING_ID');
  }

  const sql = `SELECT * FROM aro WHERE id_aro = ?`;
  try {
    const resultado = await executarQuery(sql, [id]);
    if (!resultado.length) {
      throw new AppError('Aro não encontrado', 404, 'ARO_NOT_FOUND');
    }
    return resultado[0];
  } catch (error) {
    if (!(error instanceof AppError)) {
      throw new AppError('Erro ao buscar aro por ID', 500, 'ARO_ID_ERROR', error.message);
    }
    throw error;
  }
}

async function apresentarAroPorNome(nome) {
  if (!nome) {
    throw new AppError('Nome do aro é obrigatório', 400, 'MISSING_NAME');
  }

  const sql = `SELECT * FROM aro WHERE nome_aro = ?`;
  try {
    const resultado = await executarQuery(sql, [nome]);
    if (!resultado.length) {
      throw new AppError('Aro com esse nome não encontrado', 404, 'ARO_NOT_FOUND');
    }
    return resultado[0];
  } catch (error) {
    if (!(error instanceof AppError)) {
      throw new AppError('Erro ao buscar aro por nome', 500, 'ARO_NAME_ERROR', error.message);
    }
    throw error;
  }
}

export { apresentarAro, apresentarAroPorId, apresentarAroPorNome };
