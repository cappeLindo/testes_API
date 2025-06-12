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

async function apresentarMarca(req, res, next) {
  const sql = `SELECT * FROM marca`;
  try {
    const resultado = await executarQuery(sql);
    return resultado;
  } catch (error) {
    if (!(error instanceof AppError)) {
      throw new AppError('Erro ao apresentar marca', 500, 'MARCA_LIST_ERROR', error.message);
    }
    throw error;
  }
}

async function apresentarMarcaPorId(id) {
  if (!id) {
    throw new AppError('ID da marca é obrigatório', 400, 'MISSING_ID');
  }

  const sql = `SELECT * FROM marca WHERE id = ?`;
  try {
    const resultado = await executarQuery(sql, [id]);

    return resultado;
  } catch (error) {
    if (!(error instanceof AppError)) {
      throw new AppError('Erro ao buscar marca por ID', 500, 'MARCA_ID_ERROR', error.message);
    }
    throw error;
  }
}

async function apresentarMarcaPorNome(nome) {
  if (!nome) {
    throw new AppError('Nome da marca é obrigatório', 400, 'MISSING_NAME');
  }

  const sql = `SELECT * FROM marca WHERE nome LIKE ?`;
  try {
    const resultado = await executarQuery(sql, [`%${nome}%`]);

    return resultado;
  } catch (error) {
    if (!(error instanceof AppError)) {
      throw new AppError('Erro ao buscar marca por nome', 500, 'MARCA_NAME_ERROR', error.message);
    }
    throw error;
  }
}

export { apresentarMarca, apresentarMarcaPorId, apresentarMarcaPorNome };
