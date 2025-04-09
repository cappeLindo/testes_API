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

async function editarMarca(id, nome) {
    try {
        id = parseInt(id, 10); // Garantindo que id seja um número inteiro
        if (!nome) {
            throw new AppError('Nome da marca é obrigatório', 400, 'MISSING_NAME');
        }
        const sql = "UPDATE marca SET nome_marca = ? WHERE id_marca = ?";
        const resultado = await executarQuery(sql, [nome, id]);
        return resultado;
    } catch (error) {
        throw new AppError('Erro ao editar marca', 400, 'MARCA_EDIT_ERROR', error.message);
    }
}

export { editarMarca }