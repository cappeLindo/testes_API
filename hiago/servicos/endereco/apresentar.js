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

async function apresentarEndereco() {
  const sql = `SELECT id, cep, estado, cidade, bairro, rua FROM endereco`;
  return await executarQuery(sql);
}

async function apresentarEnderecoPorId(id) {
  const sql = `SELECT id, cep, estado, cidade, bairro, rua FROM endereco WHERE id = ?`;
  return await executarQuery(sql, [id]);
}

async function apresentarEnderecoPorCidade(cidade) {
  const sql = `SELECT id, cep, estado, cidade, bairro, rua FROM endereco WHERE cidade LIKE ?`;
  return await executarQuery(sql, [`%${cidade}%`]);
}

export { apresentarEndereco, apresentarEnderecoPorId, apresentarEnderecoPorCidade };