import pool from '../../../config.js';
import AppError from '../../utils/appError.js';

export default async function adicionarCliente(cliente) {
  const { nome_cliente, cpf_cliente, email_cliente, telefone_cliente, imagem_cliente } = cliente;

  try {
    const conexao = await pool.getConnection();

    const [resultado] = await conexao.execute(
      `INSERT INTO cliente (nome_cliente, cpf_cliente, email_cliente, telefone_cliente, imagem_cliente)
       VALUES (?, ?, ?, ?, ?)`,
      [nome_cliente, cpf_cliente, email_cliente, telefone_cliente, imagem_cliente || null]
    );

    conexao.release();

    return {
      id_cliente: resultado.insertId,
      nome_cliente,
      cpf_cliente,
      email_cliente,
      telefone_cliente,
      imagem_cliente
    };
  } catch (erro) {
    throw new AppError('Erro ao adicionar cliente.', 500, 'ERRO_INSERCAO_CLIENTE', erro.message);
  }
}
