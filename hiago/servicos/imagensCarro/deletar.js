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

async function deletarImagem(id) {
  try {
    const sql = 'DELETE FROM imagensCarro WHERE id = ?';
    const resultado = await executarQuery(sql, [id]);
    return resultado;
  } catch (error) {
    throw new AppError('Erro ao deletar imagem.', 500, 'IMAGE_DELETE_ERROR', error.message);
  }
}

async function deletarImagemAnuncio(carro_id) {
  try {
    const sql = 'DELETE FROM imagensCarro WHERE carro_id = ?';
    const resultado = await executarQuery(sql, [carro_id]);
    return resultado;
  } catch (error) {
    throw new AppError('Erro ao deletar imagens do anúncio.', 500, 'IMAGE_ANUNCIO_DELETE_ERROR', error.message);
  }
}

export { deletarImagem, deletarImagemAnuncio };