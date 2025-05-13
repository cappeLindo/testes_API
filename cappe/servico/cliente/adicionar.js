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

export default async function adicionarCliente(cliente) {
  const { nome_cliente, cpf_cliente, email_cliente, telefone_cliente, imagem_cliente } = cliente;
  const sql = `INSERT INTO cliente (nome_cliente, cpf_cliente, email_cliente, telefone_cliente, imagem_cliente)
               VALUES (?, ?, ?, ?, ?)`;
  return await executarQuery(sql, [nome_cliente, cpf_cliente, email_cliente, telefone_cliente, imagem_cliente]);
}