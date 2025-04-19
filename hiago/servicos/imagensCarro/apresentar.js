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

async function apresentarImagens(req, res, next) {
  const sql = `SELECT * FROM imagensCarro`;
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

async function apresentarImagemPorId(id) {
  if (!id) {
    throw new AppError('ID da imagem é obrigatório', 400, 'MISSING_ID');
  }

  const sql = `SELECT * FROM imagensCarro WHERE id_imagensCarro = ?`;
  try {
    const resultado = await executarQuery(sql, [id]);

    return resultado;
  } catch (error) {
    if (!(error instanceof AppError)) {
      throw new AppError('Erro ao buscar imagem por ID', 500, 'IMAGEM_ID_ERROR', error.message);
    }
    throw error;
  }
}

async function apresentarImagemPorNome(nome) {
  if (!nome) {
    throw new AppError('Nome da imagem é obrigatório', 400, 'MISSING_NAME');
  }

  const sql = `SELECT * FROM imagensCarro WHERE nome_imagensCarro LIKE ?`;
  try {
    const resultado = await executarQuery(sql, [`%${nome}%`]);

    return resultado;
  } catch (error) {
    if (!(error instanceof AppError)) {
      throw new AppError('Erro ao buscar imagem por nome', 500, 'IMAGEM_NAME_ERROR', error.message);
    }
    throw error;
  }
}


async function apresentarImagemPorIdAnuncio(id) {
  if (!id) {
    throw new AppError('ID do anuncio é obrigatório', 400, 'MISSING_ID');
  }

  const sql = `SELECT * FROM imagensCarro WHERE anuncioCarro_id_anuncioCarro = ?`;
  try {
    const resultado = await executarQuery(sql, [id]);

    return resultado;
  } catch (error) {
    if (!(error instanceof AppError)) {
      throw new AppError('Erro ao buscar imagem por ID do anuncio', 500, 'IMAGEM_ANUNCIO_ID_ERROR', error.message);
    }
    throw error;
  }
}


export { apresentarImagens, apresentarImagemPorId, apresentarImagemPorNome, apresentarImagemPorIdAnuncio };
