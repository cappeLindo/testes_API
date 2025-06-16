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

async function deletarFavoritosCarrosByCliente(idCliente) {
  const sql = `DELETE FROM favoritos WHERE cliente_id = ?`;
  return await executarQuery(sql, [idCliente]);
}

async function deletarFavoritosCarrosByCarro(idCarro) {
  const sql = `DELETE FROM favoritos WHERE carro_id = ?`;
  return await executarQuery(sql, [idCarro]);
}

async function deletarFavoritosCarrosByCarroAndCliente(idCarro, idCliente) {
  const sql = `DELETE FROM favoritos WHERE carro_id = ? AND cliente_id = ?`;
  return await executarQuery(sql, [idCarro, idCliente]);
}

export { deletarFavoritosCarrosByCliente, deletarFavoritosCarrosByCarro, deletarFavoritosCarrosByCarroAndCliente };