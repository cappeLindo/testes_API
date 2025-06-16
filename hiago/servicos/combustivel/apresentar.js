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

async function apresentarCombustivel(req, res, next) {
  const sql = `SELECT * FROM combustivel`;
  try {
    const resultado = await executarQuery(sql);
    return resultado;
  } catch (error) {
    if (!(error instanceof AppError)) {
      throw new AppError('Erro ao apresentar combustível', 500, 'COMBUSTIVEL_LIST_ERROR', error.message);
    }
    throw error;
  }
}

async function apresentarCombustivelPorId(id) {
  if (!id) {
    throw new AppError('ID do combustível é obrigatório', 400, 'MISSING_ID');
  }

  const sql = `SELECT * FROM combustivel WHERE id = ?`;
  try {
    const resultado = await executarQuery(sql, [id]);

    return resultado;
  } catch (error) {
    if (!(error instanceof AppError)) {
      throw new AppError('Erro ao buscar combustível por ID', 500, 'COMBUSTIVEL_ID_ERROR', error.message);
    }
    throw error;
  }
}

async function apresentarCombustivelPorNome(nome) {
  if (!nome) {
    throw new AppError('Nome do combustível é obrigatório', 400, 'MISSING_NAME');
  }

  const sql = `SELECT * FROM combustivel WHERE nome LIKE ?`;
  try {
    const resultado = await executarQuery(sql, [`%${nome}%`]);

    return resultado;
  } catch (error) {
    if (!(error instanceof AppError)) {
      throw new AppError('Erro ao buscar combustível por nome', 500, 'COMBUSTIVEL_NAME_ERROR', error.message);
    }
    throw error;
  }
}

export { apresentarCombustivel, apresentarCombustivelPorId, apresentarCombustivelPorNome };
