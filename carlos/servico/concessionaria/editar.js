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

export async function editarConcessionaria(id, nome, cnpj, email, senha, telefone, imagem) {

  const sql = `UPDATE Concessionaria SET nome = ?, cnpj = ?, email = ?, senha = ?, telefone = ?, imagem = ? WHERE id = ?`;

  const resultado = await executarQuery(sql, [
    nome,
    cnpj,
    email,
    senha,
    telefone,
    imagem || null,
    id
  ]);

  return resultado; // Também contém `affectedRows`
}


export async function editarConcessionariaParcial(id, campos) {
  const colunas = Object.keys(campos).map(campo => `${campo} = ?`).join(", ");
  const valores = Object.values(campos);
  const sql = `UPDATE Concessionaria SET ${colunas} WHERE id = ?`
  valores.push(id);
  return await executarQuery(sql, valores);
}