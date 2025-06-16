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

async function validarRelacaoFavoritosCarro({ idCarro, idCliente }) {
  if (!idCarro || !idCliente) {
    return {
      status: 400,
      mensagem: 'ID do carro e ID do cliente são obrigatórios.',
      codigo: 'MISSING_IDS',
    };
  }

  if (isNaN(idCarro) || isNaN(idCliente)) {
    return {
      status: 400,
      mensagem: 'ID do carro ou ID do cliente inválido.',
      codigo: 'INVALID_IDS',
    };
  }

  // Verifica se o carro existe
  const carro = await executarQuery('SELECT id FROM carro WHERE id = ?', [idCarro]);
  if (!carro.length) {
    return {
      status: 404,
      mensagem: 'Carro não encontrado.',
      codigo: 'CARRO_NOT_FOUND',
    };
  }

  // Verifica se o cliente existe
  const cliente = await executarQuery('SELECT id FROM cliente WHERE id = ?', [idCliente]);
  if (!cliente.length) {
    return {
      status: 404,
      mensagem: 'Cliente não encontrado.',
      codigo: 'CLIENTE_NOT_FOUND',
    };
  }

  // Verifica se a relação já existe
  const relacao = await executarQuery('SELECT carro_id, cliente_id FROM favoritos WHERE carro_id = ? AND cliente_id = ?', [idCarro, idCliente]);
  if (relacao.length) {
    return {
      status: 400,
      mensagem: 'Este carro já está nos favoritos deste cliente.',
      codigo: 'RELATION_ALREADY_EXISTS',
    };
  }

  return null;
}

function validarIdCarroBody(req, res, next) {
  const { idCarro } = req.body;
  if (!idCarro) {
    return next(new AppError('ID do carro é obrigatório.', 400, 'MISSING_ID_CARRO'));
  }
  if (isNaN(idCarro)) {
    return next(new AppError('ID do carro inválido.', 400, 'INVALID_ID_CARRO'));
  }
  next();
}

export { validarRelacaoFavoritosCarro, validarIdCarroBody };