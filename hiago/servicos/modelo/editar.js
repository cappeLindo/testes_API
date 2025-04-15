import pool from '../../../config.js';
import AppError from '../../utils/AppError.js';

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

  async function editarModeloParcial(id, campos) {
    const colunas = Object.keys(campos).map(campo => `${campo} = ?`).join(", ");
    const valores = Object.values(campos);
    const sql = `UPDATE modelo SET ${colunas} WHERE id_modelo = ?`
    valores.push(id);
    return await executarQuery(sql, valores);
}


export { editarModeloParcial }