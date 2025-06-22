import pool from '../../../config.js';
import AppError from '../../utils/appError.js';

async function executarQuery(sql, params = []) {
  let conexao;
  try {
    conexao = await pool.getConnection();
    const [resultado] = await conexao.execute(sql, params);
    return resultado;
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === 'ER_ROW_IS_REFERENCED') {
      throw new AppError(
        'Não é possível excluir a concessionária porque ela está sendo referenciada por outros dados.',
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

async function deletarConcessionaria(id) {
  try {
    const sql = `DELETE FROM concessionaria WHERE id = ?`;
    const resultado = await executarQuery(sql, [parseInt(id, 10)]);
    return resultado;
  } catch (error) {
    throw new AppError('Erro ao deletar concessionária', 500, 'CONCESSIONARIA_DELETE_ERROR', error.message);
  }
}

export { deletarConcessionaria };