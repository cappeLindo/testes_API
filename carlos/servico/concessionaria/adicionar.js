import pool from '../../../config.js';
import AppError from '../../utils/appError.js';

export default async function adicionarConcessionaria(concessionaria) {
  const { nome_concessionaria, cnpj_concessionaria, email_concessionaria, telefone_concessionaria, imagem_concessionaria, endereco_id_endereco } = concessionaria;

  try {
    const conexao = await pool.getConnection();

    const [resultado] = await conexao.execute(
      `INSERT INTO concessionaria (nome_concessionaria, cnpj_concessionaria, email_concessionaria, telefone_concessionaria, imagem_concessionaria, endereco_id_endereco)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nome_concessionaria, cnpj_concessionaria, email_concessionaria, telefone_concessionaria, imagem_concessionaria || null, endereco_id_endereco]
    );

    conexao.release();

    return {
      id_concessionaria: resultado.insertId,
      nome_concessionaria,
      cnpj_concessionaria,
      email_concessionaria,
      telefone_concessionaria,
      imagem_concessionaria,
      endereco_id_endereco
    };
  } catch (erro) {
    throw new AppError('Erro ao adicionar concessionária.', 500, 'ERRO_INSERCAO_CONCESSIONARIA', erro.message);
  }
}