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

async function adicionarConcessionaria(nome, cnpj, email, senha, telefone, imagem, endereco_id) {
  try {
    const sql = `INSERT INTO concessionaria (nome, cnpj, email, senha, telefone, imagem, endereco_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const resultado = await executarQuery(sql, [nome, cnpj, email, senha, telefone, imagem || null, parseInt(endereco_id, 10)]);
    return resultado;
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      throw new AppError('Endereço não encontrado.', 400, 'INVALID_ENDERECO_ID', error.message);
    }
    if (error.code === 'ER_DUP_ENTRY') {
      throw new AppError('Email já cadastrado.', 400, 'DUPLICATE_EMAIL', error.message);
    }
    throw new AppError('Erro ao adicionar concessionária', 500, 'CONCESSIONARIA_ADD_ERROR', error.message);
  }
}

export { adicionarConcessionaria };