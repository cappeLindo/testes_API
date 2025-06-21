import pool from '../../../config.js';
import AppError from '../../utils/AppError.js';
import { deletarImagemAnuncio } from '../imagensCarro/deletar.js';

async function executarQuery(sql, params = []) {
  let conexao;
  try {
    conexao = await pool.getConnection();
    const [resultado] = await conexao.execute(sql, params);
    return resultado;
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === 'ER_ROW_IS_REFERENCED') {
      throw new AppError(
        'Não é possível excluir o carro porque ele está sendo referenciado por outros dados.',
        409,
        'FOREIGN_KEY_CONSTRAINT',
        error.message
      );
    }
    throw new AppError('Erro ao executar o comando', 500, 'DB_EXEC_ERROR', error.message);
  } finally {
    if (conexao) conexao.release();
  }
}

async function deletarAnuncioCarro(id) {
  try {
    id = parseInt(id, 10);
    await deletarImagemAnuncio(id);
    const sql = 'DELETE FROM carro WHERE id = ?';
    const resultado = await executarQuery(sql, [id]);
    return resultado;
  } catch (error) {
    throw new AppError('Erro ao deletar carro.', 500, 'CARRO_DELETE_ERROR', error.message);
  }
}

export { deletarAnuncioCarro };