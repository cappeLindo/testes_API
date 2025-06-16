import pool from '../../../config.js';
import AppError from '../../utils/appError.js';

export default async function adicionarCliente(nome, cpf, email, senha, telefone, imagem) {

  try {
    const conexao = await pool.getConnection();

    const [resultado] = await conexao.execute(
      `INSERT INTO cliente (nome, cpf, email, senha, telefone, imagem) VALUES (?, ?, ?, ?, ?, ?)`,
      [nome, cpf, email, senha, telefone, imagem]
    );

    conexao.release();

    return {
      id: resultado.insertId,
      nome,
      cpf,
      email,
      senha,
      telefone
    };
  } catch (erro) {
    throw new AppError('Erro ao adicionar cliente.', 500, 'ERRO_INSERCAO', erro.message);
  }
}
