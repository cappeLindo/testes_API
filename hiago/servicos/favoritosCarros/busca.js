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

const sqlPadrao = `
  SELECT 
    f.carro_id,
    c.nome AS nomeCarro,
    f.cliente_id,
    cl.nome AS nomeCliente
  FROM favoritos f
  JOIN carro c ON f.carro_id = c.id
  JOIN cliente cl ON f.cliente_id = cl.id
`;

async function buscarFavoritosCarros() {
  return await executarQuery(sqlPadrao);
}

async function buscarFavoritosCarrosByIdCliente(idCliente) {
  const sql = `${sqlPadrao} WHERE f.cliente_id = ?`;
  return await executarQuery(sql, [idCliente]);
}

async function buscarFavoritosCarrosByIdCarro(idCarro) {
  const sql = `${sqlPadrao} WHERE f.carro_id = ?`;
  return await executarQuery(sql, [idCarro]);
}

async function buscarFavoritosCarrosByIdClienteAndIdCarro(idCliente, idCarro) {
  const sql = `${sqlPadrao} WHERE f.cliente_id = ? AND f.carro_id = ?`;
  return await executarQuery(sql, [idCliente, idCarro]);
}

export { buscarFavoritosCarros, buscarFavoritosCarrosByIdCarro, buscarFavoritosCarrosByIdClienteAndIdCarro, buscarFavoritosCarrosByIdCliente };