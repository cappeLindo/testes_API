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

async function apresentarCambio(req, res, next) {
  const sql = `SELECT * FROM cambio`;
  try {
    const resultado = await executarQuery(sql);
    return resultado;
  } catch (error) {
    if (!(error instanceof AppError)) {
      throw new AppError('Erro ao apresentar câmbio', 500, 'CAMBIO_LIST_ERROR', error.message);
    }
    throw error;
  }
}

async function apresentarCambioPorId(id) {
  if (!id) {
    throw new AppError('ID do câmbio é obrigatório', 400, 'MISSING_ID');
  }

  const sql = `SELECT * FROM cambio WHERE id_cambio = ?`;
  try {
    const resultado = await executarQuery(sql, [id]);

    return resultado;
  } catch (error) {
    if (!(error instanceof AppError)) {
      throw new AppError('Erro ao buscar câmbio por ID', 500, 'CAMBIO_ID_ERROR', error.message);
    }
    throw error;
  }
}

async function apresentarCambioPorNome(nome) {
  if (!nome) {
    throw new AppError('Nome do câmbio é obrigatório', 400, 'MISSING_NAME');
  }

  const sql = `SELECT * FROM cambio WHERE nome_cambio LIKE ?`;
  try {
    const resultado = await executarQuery(sql, [`%${nome}%`]);

    return resultado;
  } catch (error) {
    if (!(error instanceof AppError)) {
      throw new AppError('Erro ao buscar câmbio por nome', 500, 'CAMBIO_NAME_ERROR', error.message);
    }
    throw error;
  }
}

export { apresentarCambio, apresentarCambioPorId, apresentarCambioPorNome };
