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

async function adicionarEndereco(estado, cidade, bairro, rua) {
  const sql = `INSERT INTO endereco (estado, cidade, bairro, rua) VALUES (?, ?, ?, ?);`;
  return await executarQuery(sql, [estado, cidade, bairro, rua]);
}

export { adicionarEndereco };