import pool from '../../../config.js';
import AppError from '../../utils/appError.js';

export default async function adicionarConcessionaria(nome, cnpj, email, senha, telefone, imagem, endereco_id) {

  try {
    const conexao = await pool.getConnection();

    const [resultado] = await conexao.execute(
      `INSERT INTO concessionaria (nome, cnpj, email, senha, telefone, imagem, endereco_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nome, cnpj, email, senha, telefone, imagem, endereco_id]
    );

    conexao.release();

    return {
      id: resultado.insertId,
      nome,
      cnpj,
      email,
      senha,
      telefone,
      endereco_id
    };
  } catch (erro) {
    throw new AppError('Erro ao adicionar concessionária.', 500, 'ERRO_INSERCAO', erro.message);
  }
}