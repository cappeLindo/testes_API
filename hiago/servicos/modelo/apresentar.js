import pool from '../../../config.js';
import AppError from '../../utils/AppError.js';

const sqlpadrao = 'SELECT modelo.id_modelo, modelo.nome_modelo, marca.id_marca, marca.nome_marca, categoria.id_categoria, categoria.nome_categoria FROM modelo JOIN marca ON modelo.marca_id_marca = marca.id_marca JOIN categoria ON modelo.categoria_id_categoria = categoria.id_categoria'

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

async function apresentarModelo(req, res, next) {
  const sql = sqlpadrao;
  try {
    const resultado = await executarQuery(sql);
    return resultado;
  } catch (error) {
    if (!(error instanceof AppError)) {
      throw new AppError('Erro ao apresentar modelo', 500, 'MODELO_LIST_ERROR', error.message);
    }
    throw error;
  }
}

async function apresentarModeloPorId(id) {
  if (!id) {
    throw new AppError('ID do modelo é obrigatório', 400, 'MISSING_ID');
  }

  const sql = `${sqlpadrao} WHERE modelo.id_modelo = ?`;
  try {
    const resultado = await executarQuery(sql, [id]);

    return resultado;
  } catch (error) {
    if (!(error instanceof AppError)) {
      throw new AppError('Erro ao buscar modelo por ID', 500, 'MODELO_ID_ERROR', error.message);
    }
    throw error;
  }
}

async function apresentarModeloPorNome(nome) {
  if (!nome) {
    throw new AppError('Nome do modelo é obrigatório', 400, 'MISSING_NAME');
  }

  const sql = `${sqlpadrao} WHERE nome_modelo LIKE ?`;
  try {
    const resultado = await executarQuery(sql, [`%${nome}%`]);

    return resultado;
  } catch (error) {
    if (!(error instanceof AppError)) {
      throw new AppError('Erro ao buscar modelo por nome', 500, 'MODELO_NAME_ERROR', error.message);
    }
    throw error;
  }
}

async function apresentarModeloPorIdCategoria(id) {
  if (!id) {
    throw new AppError('ID da categoria do modelo é obrigatório', 400, 'MISSING_ID_CATEGORIA');
  }

  const sql = `${sqlpadrao} WHERE modelo.id_categoria = ?`;
  try {
    const resultado = await executarQuery(sql, [id]);

    return resultado;
  } catch (error) {
    if (!(error instanceof AppError)) {
      throw new AppError('Erro ao buscar modelo por ID da categoria', 500, 'MODELO_CATEGORIA_ID_ERROR', error.message);
    }
    throw error;
  }
}

async function apresentarModeloPorNomeCategoria(nome) {
  if (!nome) {
    throw new AppError('Nome da cateogira do modelo é obrigatório', 400, 'MISSING_NAME_CATEGORIA');
  }

  const sql = `${sqlpadrao} WHERE nome_categoria LIKE ?`;
  try {
    const resultado = await executarQuery(sql, [`%${nome}%`]);

    return resultado;
  } catch (error) {
    if (!(error instanceof AppError)) {
      throw new AppError('Erro ao buscar modelo por nome da categoria', 500, 'MODELO_CATEGORIA_NAME_ERROR', error.message);
    }
    throw error;
  }
}

async function apresentarModeloPorIdMarca(id) {
  if (!id) {
    throw new AppError('ID da marca do modelo é obrigatório', 400, 'MISSING_ID_MARCA');
  }

  const sql = `${sqlpadrao} WHERE modelo.marca_id_marca = ?`;
  try {
    const resultado = await executarQuery(sql, [id]);

    return resultado;
  } catch (error) {
    if (!(error instanceof AppError)) {
      throw new AppError('Erro ao buscar modelo por ID', 500, 'MODELO_MARCA_ID_ERROR', error.message);
    }
    throw error;
  }
}

async function apresentarModeloPorNomeMarca(nome) {
  if (!nome) {
    throw new AppError('Nome do modelo é obrigatório', 400, 'MISSING_NAME_MARCA');
  }

  const sql = `${sqlpadrao} WHERE nome_marca LIKE ?`;
  try {
    const resultado = await executarQuery(sql, [`%${nome}%`]);

    return resultado;
  } catch (error) {
    if (!(error instanceof AppError)) {
      throw new AppError('Erro ao buscar modelo por nome da marca', 500, 'MODELO_MARCA_NAME_ERROR', error.message);
    }
    throw error;
  }
}



export { apresentarModelo, apresentarModeloPorId, apresentarModeloPorNome, apresentarModeloPorIdMarca, apresentarModeloPorIdCategoria, apresentarModeloPorNomeMarca, apresentarModeloPorNomeCategoria };
