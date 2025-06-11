import pool from '../../../config.js';
import AppError from '../../utils/appError.js';

export default async function adicionarConcessionaria(concessionaria) {
  const { nome, cnpj, email, telefone, imagem, endereco_id } = concessionaria;

  try {
    const conexao = await pool.getConnection();

    const [resultado] = await conexao.execute(
      `INSERT INTO concessionaria (nome, cnpj, email, telefone, imagem, endereco_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nome, cnpj, email, telefone, imagem || null, endereco_id]
    );

    conexao.release();

    return {
      id: resultado.insertId,
      nome,
      cnpj,
      email,
      telefone,
      imagem,
      endereco_id
    };
  } catch (erro) {
    throw new AppError('Erro ao adicionar concessionária.', 500, 'ERRO_INSERCAO', erro.message);
  }
}