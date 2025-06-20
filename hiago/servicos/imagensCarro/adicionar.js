import pool from '../../../config.js';
import AppError from '../../utils/AppError.js';

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

async function adicionarImagem(nome, carro_id, buffer) {
  try {
    const sql = 'INSERT INTO imagensCarro (nome, arquivo, carro_id) VALUES (?, ?, ?)';
    const resultado = await executarQuery(sql, [nome, buffer, carro_id]);
    return resultado;
  } catch (error) {
    throw new AppError('Erro ao adicionar imagem.', 500, 'IMAGE_INSERT_ERROR', error.message);
  }
}

export { adicionarImagem };