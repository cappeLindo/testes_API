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

async function editarConcessionaria(id, nome, cnpj, email, senha, telefone, imagem, endereco_id) {
  try {
    const sql = `UPDATE concessionaria SET nome = ?, cnpj = ?, email = ?, senha = ?, telefone = ?, imagem = ?, endereco_id = ? WHERE id = ?`;
    const resultado = await executarQuery(sql, [
      nome,
      cnpj,
      email,
      senha,
      telefone,
      imagem || null,
      parseInt(endereco_id, 10),
      parseInt(id, 10)
    ]);
    return resultado;
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      throw new AppError('Endereço não encontrado.', 400, 'INVALID_ENDERECO_ID', error.message);
    }
    if (error.code === 'ER_DUP_ENTRY') {
      throw new AppError('Email já cadastrado.', 400, 'DUPLICATE_EMAIL', error.message);
    }
    throw new AppError('Erro ao editar concessionária', 500, 'CONCESSIONARIA_EDIT_ERROR', error.message);
  }
}

async function editarConcessionariaParcial(id, campos) {
  try {
    const colunas = Object.keys(campos).map(campo => `${campo} = ?`).join(', ');
    const valores = Object.values(campos);
    valores.push(parseInt(id, 10));
    const sql = `UPDATE concessionaria SET ${colunas} WHERE id = ?`;
    const resultado = await executarQuery(sql, valores);
    return resultado;
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      throw new AppError('Endereço não encontrado.', 400, 'INVALID_ENDERECO_ID', error.message);
    }
    if (error.code === 'ER_DUP_ENTRY') {
      throw new AppError('Email já cadastrado.', 400, 'DUPLICATE_EMAIL', error.message);
    }
    throw new AppError('Erro ao editar concessionária parcialmente', 500, 'CONCESSIONARIA_PATCH_ERROR', error.message);
  }
}

export { editarConcessionaria, editarConcessionariaParcial };