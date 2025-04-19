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

async function editarAnuncioCarro(id, nome, id_marca, id_categoria) {
  try {
      id = parseInt(id, 10); // Garantindo que id seja um número inteiro
      if (!nome) {
          throw new AppError('Nome da modelo é obrigatório', 400, 'MISSING_NAME');
      }
      const sql = "UPDATE modelo SET nome_modelo = ?, marca_id_marca = ?, categoria_id_categoria = ? WHERE id_modelo = ?";
      const resultado = await executarQuery(sql, [nome, id_marca, id_categoria, id]);
      return resultado;
  } catch (error) {
      throw new AppError('Erro ao editar modelo', 400, 'MODELO_EDIT_ERROR', error.message);
  }
}

async function editarAnuncioCarroParcial(id, campos) {
  const colunas = Object.keys(campos).map(campo => `${campo} = ?`).join(", ");
  const valores = Object.values(campos);
  const sql = `UPDATE anuncioCarro SET ${colunas} WHERE id_anuncioCarro = ?`
  valores.push(id);
  return await executarQuery(sql, valores);
}


export { editarAnuncioCarro, editarAnuncioCarroParcial };