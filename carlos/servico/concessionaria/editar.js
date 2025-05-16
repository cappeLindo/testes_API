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

export default async function editarConcessionaria(id, concessionaria) {
  const { nome_concessionaria, cnpj_concessionaria, email_concessionaria, telefone_concessionaria, imagem_concessionaria, endereco_id_endereco } = concessionaria;

  const sql = `
    UPDATE concessionaria 
    SET nome_concessionaria = ?, cnpj_concessionaria = ?, email_concessionaria = ?, telefone_concessionaria = ?, imagem_concessionaria = ?, endereco_id_endereco = ?
    WHERE id_concessionaria = ?
  `;

  const resultado = await executarQuery(sql, [
    nome_concessionaria,
    cnpj_concessionaria,
    email_concessionaria,
    telefone_concessionaria,
    imagem_concessionaria || null,
    endereco_id_endereco,
    id
  ]);

  return resultado;
}