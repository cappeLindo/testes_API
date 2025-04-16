import pool from '../../../config.js';
import AppError from '../../utils/AppError.js';

const sqlPadrao = "SELECT ac.id_anuncioCarro, ac.nome_anuncioCarro, ac.modelo_id_modelo, m.nome_modelo, ac.marca_id_marca, ma.nome_marca, ac.categoria_id_categoria, c.nome_categoria, ac.cor_id_cor, co.nome_cor, ac.aro_id_aro, a.nome_aro, ac.combustivel_id_combustivel, cb.nome_combustivel, ac.cambio_id_cambio, ca.nome_cambio, ac.concessionaria_id_concessionaria, cs.nome_concessionaria FROM `Web-Cars`.anuncioCarro ac INNER JOIN `Web-Cars`.modelo m ON ac.modelo_id_modelo = m.id_modelo INNER JOIN `Web-Cars`.marca ma ON ac.marca_id_marca = ma.id_marca INNER JOIN `Web-Cars`.categoria c ON ac.categoria_id_categoria = c.id_categoria INNER JOIN `Web-Cars`.cor co ON ac.cor_id_cor = co.id_cor INNER JOIN `Web-Cars`.aro a ON ac.aro_id_aro = a.id_aro INNER JOIN `Web-Cars`.combustivel cb ON ac.combustivel_id_combustivel = cb.id_combustivel INNER JOIN `Web-Cars`.cambio ca ON ac.cambio_id_cambio = ca.id_cambio INNER JOIN `Web-Cars`.concessionaria cs ON ac.concessionaria_id_concessionaria = cs.id_concessionaria"


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

  const sql = `${sqlPadrao} WHERE ac.id_anuncioCarro = ?`;
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

  const sql = `${sqlPadrao} WHERE ac.nome_anuncioCarro LIKE ?`;
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
