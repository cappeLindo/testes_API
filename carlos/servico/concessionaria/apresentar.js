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

export default async function apresentarConcessionaria(id = null) {
  const sql = id ? `SELECT * FROM concessionaria WHERE id_concessionaria = ?` : `SELECT * FROM concessionaria`;
  const params = id ? [id] : [];

  const resultado = await executarQuery(sql, params);

  if (!resultado || resultado.length === 0) {
    throw new AppError(id ? 'Concessionária não encontrada.' : 'Nenhuma concessionária encontrada.', 404, id ? 'CONCESSIONARIA_NAO_ENCONTRADA' : 'CONCESSIONARIAS_NAO_ENCONTRADAS');
  }

  return resultado;
}