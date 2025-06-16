import pool from '../../config.js';
import AppError from '../utils/AppError.js';

async function executarQuery(sql, params = []) {
  let conexao;
  try {
    conexao = await pool.getConnection();
    const [resultado] = await conexao.execute(sql, params);
    return resultado;
  } catch (error) {
    throw new AppError('Erro ao executar o comando.', 500, 'DB_EXEC_ERROR', error.message);
  } finally {
    if (conexao) conexao.release();
  }
}

async function validarEndereco({ estado, cidade, bairro, rua }) {
  if (typeof estado !== 'string' || estado.length > 45 || estado.trim() === '') {
    return {
      status: false,
      mensagem: 'Estado inválido ou excede 45 caracteres.',
    };
  }
  if (typeof cidade !== 'string' || cidade.length > 45 || cidade.trim() === '') {
    return {
      status: false,
      mensagem: 'Cidade inválida ou excede 45 caracteres.',
    };
  }
  if (typeof bairro !== 'string' || bairro.length > 45 || bairro.trim() === '') {
    return {
      status: false,
      mensagem: 'Bairro inválido ou excede 45 caracteres.',
    };
  }
  if (typeof rua !== 'string' || rua.length > 45 || rua.trim() === '') {
    return {
      status: false,
      mensagem: 'Rua inválida ou excede 45 caracteres.',
    };
  }

  // Verifica se o endereço já existe
  const sql = `SELECT id FROM endereco WHERE estado = ? AND cidade = ? AND bairro = ? AND rua = ?`;
  const resultado = await executarQuery(sql, [estado, cidade, bairro, rua]);
  if (resultado.length > 0) {
    return {
      status: false,
      mensagem: 'Endereço já cadastrado.',
    };
  }

  return { status: true };
}

async function validarEnderecoParcial(campos) {
  if (campos.estado !== undefined && (typeof campos.estado !== 'string' || campos.estado.length > 45 || campos.estado.trim() === '')) {
    return {
      status: false,
      mensagem: 'Estado inválido ou excede 45 caracteres.',
    };
  }
  if (campos.cidade !== undefined && (typeof campos.cidade !== 'string' || campos.cidade.length > 45 || campos.cidade.trim() === '')) {
    return {
      status: false,
      mensagem: 'Cidade inválida ou excede 45 caracteres.',
    };
  }
  if (campos.bairro !== undefined && (typeof campos.bairro !== 'string' || campos.bairro.length > 45 || campos.bairro.trim() === '')) {
    return {
      status: false,
      mensagem: 'Bairro inválido ou excede 45 caracteres.',
    };
  }
  if (campos.rua !== undefined && (typeof campos.rua !== 'string' || campos.rua.length > 45 || campos.rua.trim() === '')) {
    return {
      status: false,
      mensagem: 'Rua inválida ou excede 45 caracteres.',
    };
  }

  // Verifica duplicata apenas se todos os campos forem fornecidos
  if (campos.estado && campos.cidade && campos.bairro && campos.rua) {
    const sql = `SELECT id FROM endereco WHERE estado = ? AND cidade = ? AND bairro = ? AND rua = ?`;
    const resultado = await executarQuery(sql, [campos.estado, campos.cidade, campos.bairro, campos.rua]);
    if (resultado.length > 0) {
      return {
        status: false,
        mensagem: 'Endereço já cadastrado.',
      };
    }
  }

  return { status: true };
}

export { validarEndereco, validarEnderecoParcial };