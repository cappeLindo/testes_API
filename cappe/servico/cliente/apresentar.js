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

async function apresentarCliente(id = null) {
  // Se um ID for passado, busca o cliente específico, caso contrário, retorna todos os clientes
  const sql = id ? `SELECT id, nome, email, cpf, senha, telefone FROM cliente WHERE id = ?` : `SELECT id, nome, email, cpf, senha, telefone FROM cliente`;
  const params = id ? [id] : [];

  const resultado = await executarQuery(sql, params);

  if (!resultado || resultado.length === 0) {
    throw new AppError(id ? 'Cliente não encontrado.' : 'Nenhum cliente encontrado.', 404, id ? 'CLIENTE_NAO_ENCONTRADO' : 'CLIENTES_NAO_ENCONTRADOS');
  }

  return resultado;
}

async function apresentarClientePorEmail(email) {
  const sql = `SELECT id, nome, email, cpf, senha, telefone FROM cliente WHERE email LIKE ?`;

  const resultado = await executarQuery(sql, [`%${email}%`]);

  if (!resultado || resultado.length === 0) {
    throw new AppError(email ? 'Cliente não encontrado.' : 'Nenhum cliente encontrado.', 404, email ? 'CLIENTE_NAO_ENCONTRADO' : 'CLIENTES_NAO_ENCONTRADOS');
  }

  return resultado;
}

async function apresentarClientePorNome(nome) {
  const sql = `SELECT id, nome, email, cpf, senha, telefone FROM cliente WHERE nome LIKE ?`;

  const resultado = await executarQuery(sql, [`%${nome}%`]);

  if (!resultado || resultado.length === 0) {
    throw new AppError(nome ? 'Cliente não encontrado.' : 'Nenhum cliente encontrado.', 404, nome ? 'CLIENTE_NAO_ENCONTRADO' : 'CLIENTES_NAO_ENCONTRADOS');
  }

  return resultado;
}

async function apresentarFotoPerfilPorId(id) {
  const sql = `SELECT imagem FROM cliente WHERE id = ?`;
  const params = [id];

  const resultado = await executarQuery(sql, params);

  if (!resultado || resultado.length === 0) {
    throw new AppError(id ? 'Cliente não encontrado.' : 'Nenhum cliente encontrado.', 404, id ? 'CLIENTE_NAO_ENCONTRADO' : 'CLIENTES_NAO_ENCONTRADOS');
  }

  return resultado;
}

export { apresentarCliente, apresentarClientePorEmail, apresentarClientePorNome, apresentarFotoPerfilPorId }