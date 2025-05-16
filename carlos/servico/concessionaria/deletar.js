import pool from '../../../config.js';
import AppError from '../../utils/appError.js';

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

export default async function deletarConcessionaria(id) {
  const sql = `DELETE FROM concessionaria WHERE id_concessionaria = ?`;
  const resultado = await executarQuery(sql, [id]);

  if (!resultado || resultado.affectedRows === 0) {
    throw new AppError('Concessionária não encontrada para exclusão.', 404, 'CONCESSIONARIA_NAO_ENCONTRADA');
  }

  return resultado;
}