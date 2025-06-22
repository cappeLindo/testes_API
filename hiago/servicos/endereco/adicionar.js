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

async function adicionarEndereco(cep, estado, cidade, bairro, rua) {
  const sql = `INSERT INTO endereco (cep, estado, cidade, bairro, rua) VALUES (?, ?, ?, ?, ?);`;
  const resultado = await executarQuery(sql, [cep, estado, cidade, bairro, rua]);
   return { id: resultado.insertId }; // 👈 retorna o ID
}

export { adicionarEndereco };