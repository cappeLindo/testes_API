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

async function apresentarImagemPorId(idImagem) {
  if (!idImagem || isNaN(idImagem)) {
    throw new AppError('ID da imagem é obrigatório.', 400, 'MISSING_IMAGE_ID');
  }

  const sql = 'SELECT id, arquivo FROM imagensCarro WHERE id = ?';
  try {
    const resultado = await executarQuery(sql, [idImagem]);
    return resultado[0];
  } catch (error) {
    throw new AppError('Erro ao buscar imagem por ID.', 500, 'IMAGE_ID_ERROR', error.message);
  }
}

async function apresentarImagemPorIdAnuncio(idAnuncio) {
  if (!idAnuncio || isNaN(idAnuncio)) {
    throw new AppError('ID do anúncio é obrigatório.', 400, 'MISSING_ANUNCIO_ID');
  }

  const sql = 'SELECT id, arquivo FROM imagensCarro WHERE carro_id = ?';
  try {
    const resultado = await executarQuery(sql, [idAnuncio]);
    return resultado;
  } catch (error) {
    throw new AppError('Erro ao buscar imagens por ID do anúncio.', 500, 'IMAGE_ANUNCIO_ERROR', error.message);
  }
}

export { apresentarImagemPorId, apresentarImagemPorIdAnuncio };