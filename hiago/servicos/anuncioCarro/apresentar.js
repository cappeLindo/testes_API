import pool from '../../../config.js';
import AppError from '../../utils/AppError.js';

const sqlPadrao = "SELECT ac.id, ac.nome, ac.modelo_id, m.nome, ac.marca_id, ma.nome, ac.categoria_id, c.nome, ac.cor_id, co.nome, ac.aro_id, a.nome, ac.combustivel_id, cb.nome, ac.cambio_id, ca.nome, ac.concessionaria_id, cs.nome FROM `webcars_db`.anuncioCarro ac INNER JOIN `webcars_db`.modelo m ON ac.modelo_id = m.id INNER JOIN `webcars_db`.marca ma ON ac.marca_id = ma.id INNER JOIN `webcars_db`.categoria c ON ac.categoria_id = c.id INNER JOIN `webcars_db`.cor co ON ac.cor_id = co.id INNER JOIN `webcars_db`.aro a ON ac.aro_id = a.id INNER JOIN `webcars_db`.combustivel cb ON ac.combustivel_id = cb.id INNER JOIN `webcars_db`.cambio ca ON ac.cambio_id = ca.id INNER JOIN `webcars_db`.concessionaria cs ON ac.concessionaria_id = cs.id"


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

async function apresentarCarro(req, res, next) {
  try {
    const resultado = await executarQuery(sqlPadrao);
    return resultado;
  } catch (error) {
    if (!(error instanceof AppError)) {
      throw new AppError('Erro ao apresentar aro', 500, 'CARRO_LIST_ERROR', error.message);
    }
    throw error;
  }
}

async function apresentarCarroPorID(id) {
  if (!id) {
    throw new AppError('ID do aro é obrigatório', 400, 'MISSING_ID');
  }

  const sql = `${sqlPadrao} WHERE ac.id = ?`;
  try {
    const resultado = await executarQuery(sql, [id]);

    return resultado;
  } catch (error) {
    if (!(error instanceof AppError)) {
      throw new AppError('Erro ao buscar aro por ID', 500, 'ARO_ID_ERROR', error.message);
    }
    throw error;
  }
}

async function apresentarCarroPorNome(nome) {
  if (!nome) {
    throw new AppError('Nome do carro é obrigatório', 400, 'MISSING_NAME');
  }

  const sql = `${sqlPadrao} WHERE ac.nome LIKE ?`;
  try {
    const resultado = await executarQuery(sql, [`%${nome}%`]);

    return resultado;
  } catch (error) {
    if (!(error instanceof AppError)) {
      throw new AppError('Erro ao buscar aro por nome', 500, 'ARO_NAME_ERROR', error.message);
    }
    throw error;
  }
}

export { apresentarCarro, apresentarCarroPorNome, apresentarCarroPorID };
