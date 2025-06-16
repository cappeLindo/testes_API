import pool from '../../../config.js';
import AppError from '../../utils/AppError.js';

async function executarQuery(sql, params = []) {
  let conexao;
  try {
    conexao = await pool.getConnection();
    const [resultado] = await conexao.execute(sql, params);
    return resultado;
  } catch (error) {
    throw new AppError('Erro ao executar o comando.', 500, 'DB_EXEC_ERROR', error.message);
  } finally {
    if (conexao) conexao.release();
  }
}

async function deletarEndereco(id) {
  // Verifica se o endereço está associado a uma concessionária
  const checkSql = `SELECT id FROM concessionaria WHERE endereco_id = ?`;
  const checkResult = await executarQuery(checkSql, [id]);
  if (checkResult.length > 0) {
    throw new AppError('Endereço associado a uma concessionária. Não pode ser deletado.', 409, 'ENDERECO_IN_USE');
  }

  const sql = `DELETE FROM endereco WHERE id = ?`;
  return await executarQuery(sql, [id]);
}

export { deletarEndereco };