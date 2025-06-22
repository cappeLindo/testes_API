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

async function editarEndereco(id, cep, estado, cidade, bairro, rua) {
  const sql = `UPDATE endereco SET cep = ?, estado = ?, cidade = ?, bairro = ?, rua = ? WHERE id = ?`;
  return await executarQuery(sql, [cep, estado, cidade, bairro, rua, id]);
}

async function editarEnderecoParcial(id, campos) {
  const colunas = Object.keys(campos).map(campo => `${campo} = ?`).join(', ');
  const valores = Object.values(campos);
  const sql = `UPDATE endereco SET ${colunas} WHERE id = ?`;
  valores.push(id);
  return await executarQuery(sql, valores);
}

export { editarEndereco, editarEnderecoParcial };