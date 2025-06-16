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

export default async function deletarCliente(id) {
  // Excluir registros da tabela filtroAlerta que fazem referência ao cliente
  const sqlFiltroAlerta = `DELETE FROM filtroAlerta WHERE cliente_id = ?`;
  await executarQuery(sqlFiltroAlerta, [id]);

  // Agora excluir o cliente
  const sqlCliente = `DELETE FROM cliente WHERE id = ?`;
  const resultado = await executarQuery(sqlCliente, [id]);

  if (!resultado || resultado.affectedRows === 0) {
    throw new AppError('Cliente não encontrado para exclusão.', 404, 'CLIENTE_NAO_ENCONTRADO');
  }

  return resultado; // Contém `affectedRows`
}