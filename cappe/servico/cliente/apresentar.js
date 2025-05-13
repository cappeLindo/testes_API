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

export default async function apresentarCliente(id = null) {
  // Se um ID for passado, busca o cliente específico, caso contrário, retorna todos os clientes
  const sql = id ? `SELECT * FROM cliente WHERE id_cliente = ?` : `SELECT * FROM cliente`;
  const params = id ? [id] : [];

  const resultado = await executarQuery(sql, params);

  if (!resultado || resultado.length === 0) {
    throw new AppError(id ? 'Cliente não encontrado.' : 'Nenhum cliente encontrado.', 404, id ? 'CLIENTE_NAO_ENCONTRADO' : 'CLIENTES_NAO_ENCONTRADOS');
  }

  return resultado;
}