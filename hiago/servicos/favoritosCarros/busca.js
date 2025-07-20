import pool from '../../../config.js';
import AppError from '../../utils/AppError.js';
import { apresentarImagemPorIdAnuncio } from '../imagensCarro/apresentar.js';

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

const sqlPadrao = `
  SELECT 
    f.carro_id,
    c.nome AS nomeCarro,
    f.cliente_id,
    cl.nome AS nomeCliente
  FROM favoritos f
  JOIN carro c ON f.carro_id = c.id
  JOIN cliente cl ON f.cliente_id = cl.id
`;

// Buscar todos os favoritos de todos os clientes
async function buscarFavoritosCarros() {
  const resultado = await executarQuery(sqlPadrao);
  const resultadoComImagens = await Promise.all(resultado.map(async (carro) => {
    const imagens = await apresentarImagemPorIdAnuncio(carro.carro_id);
    return {
      ...carro,
      imagens: imagens.map(img => img.id)
    };
  }));
  return resultadoComImagens;
}

// Buscar todos os favoritos de um cliente
async function buscarFavoritosCarrosByIdCliente(idCliente) {
  const sql = `${sqlPadrao} WHERE f.cliente_id = ?`;
  const resultado = await executarQuery(sql, [idCliente]);
  
  const resultadoComImagens = await Promise.all(resultado.map(async (carro) => {
    const imagens = await apresentarImagemPorIdAnuncio(carro.carro_id);
    return {
      ...carro,
      imagens: imagens.map(img => img.id)
    };
  }));
  
  return resultadoComImagens;
}

// Buscar todos os clientes que favoritaram um carro específico
async function buscarFavoritosCarrosByIdCarro(idCarro) {
  const sql = `${sqlPadrao} WHERE f.carro_id = ?`;
  const resultado = await executarQuery(sql, [idCarro]);

  const resultadoComImagens = await Promise.all(resultado.map(async (carro) => {
    const imagens = await apresentarImagemPorIdAnuncio(carro.carro_id);
    return {
      ...carro,
      imagens: imagens.map(img => img.id)
    };
  }));

  return resultadoComImagens;
}

// Buscar se um cliente favoritou um carro específico
async function buscarFavoritosCarrosByIdClienteAndIdCarro(idCliente, idCarro) {
  const sql = `${sqlPadrao} WHERE f.cliente_id = ? AND f.carro_id = ?`;
  const resultado = await executarQuery(sql, [idCliente, idCarro]);

  if (resultado.length === 0) return null;

  const imagens = await apresentarImagemPorIdAnuncio(resultado[0].carro_id);
  return {
    ...resultado[0],
    imagens: imagens.map(img => img.id)
  };
}

export {
  buscarFavoritosCarros,
  buscarFavoritosCarrosByIdCliente,
  buscarFavoritosCarrosByIdCarro,
  buscarFavoritosCarrosByIdClienteAndIdCarro
};
