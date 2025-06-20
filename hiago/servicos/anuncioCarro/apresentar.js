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
    throw new AppError('Erro ao executar o comando', 500, 'DB_EXEC_ERROR', error.message);
  } finally {
    if (conexao) conexao.release();
  }
}

async function apresentarCarro() {
  const sql = `
    SELECT c.*, co.nome AS cor_nome, a.nome AS aro_nome, cat.nome AS categoria_nome,
           m.nome AS marca_nome, mod.nome AS modelo_nome, comb.nome AS combustivel_nome,
           cam.nome AS cambio_nome, conc.nome AS concessionaria_nome
    FROM carro c
    JOIN cor co ON c.cor_id = co.id
    JOIN aro a ON c.aro_id = a.id
    JOIN categoria cat ON c.categoria_id = cat.id
    JOIN marca m ON c.marca_id = m.id
    JOIN modelo mod ON c.modelo_id = mod.id
    JOIN combustivel comb ON c.combustivel_id = comb.id
    JOIN cambio cam ON c.cambio_id = cam.id
    JOIN concessionaria conc ON c.concessionaria_id = conc.id
  `;

  try {
    const resultado = await executarQuery(sql);

    // Adiciona imagens a cada carro
    const resultadoComImagens = await Promise.all(resultado.map(async (carro) => {
      const imagens = await apresentarImagemPorIdAnuncio(carro.id);
      return {
        ...carro,
        imagens: imagens.map(img => img.id)
      };
    }));

    return resultadoComImagens;
  } catch (error) {
    throw new AppError('Erro ao listar carros.', 500, 'CARRO_LIST_ERROR', error.message);
  }
}

async function apresentarCarroPorId(id) {
  if (!id || isNaN(id)) {
    throw new AppError('ID do carro é obrigatório.', 400, 'MISSING_ID');
  }

  const sql = `
    SELECT c.*, co.nome AS cor_nome, a.nome AS aro_nome, cat.nome AS categoria_nome,
           m.nome AS marca_nome, mod.nome AS modelo_nome, comb.nome AS combustivel_nome,
           cam.nome AS cambio_nome, conc.nome AS concessionaria_nome
    FROM carro c
    JOIN cor co ON c.cor_id = co.id
    JOIN aro a ON c.aro_id = a.id
    JOIN categoria cat ON c.categoria_id = cat.id
    JOIN marca m ON c.marca_id = m.id
    JOIN modelo mod ON c.modelo_id = mod.id
    JOIN combustivel comb ON c.combustivel_id = comb.id
    JOIN cambio cam ON c.cambio_id = cam.id
    JOIN concessionaria conc ON c.concessionaria_id = conc.id
    WHERE c.id = ?
  `;

  try {
    const resultado = await executarQuery(sql, [id]);

    if (!resultado.length) {
      return [];
    }

    // Adiciona imagens ao carro
    const imagens = await apresentarImagemPorIdAnuncio(id);
    resultado[0].imagens = imagens.map(img => img.id);

    return resultado;
  } catch (error) {
    throw new AppError('Erro ao buscar carro por ID.', 500, 'CARRO_ID_ERROR', error.message);
  }
}

async function apresentarCarroPorNome(nome) {
  if (!nome) {
    throw new AppError('Nome do carro é obrigatório.', 400, 'MISSING_NAME');
  }

  const sql = `
    SELECT c.*, co.nome AS cor_nome, a.nome AS aro_nome, cat.nome AS categoria_nome,
           m.nome AS marca_nome, mod.nome AS modelo_nome, comb.nome AS combustivel_nome,
           cam.nome AS cambio_nome, conc.nome AS concessionaria_nome
    FROM carro c
    JOIN cor co ON c.cor_id = co.id
    JOIN aro a ON c.aro_id = a.id
    JOIN categoria cat ON c.categoria_id = cat.id
    JOIN marca m ON c.marca_id = m.id
    JOIN modelo mod ON c.modelo_id = mod.id
    JOIN combustivel comb ON c.combustivel_id = comb.id
    JOIN cambio cam ON c.cambio_id = cam.id
    JOIN concessionaria conc ON c.concessionaria_id = conc.id
    WHERE c.nome LIKE ?
  `;

  try {
    const resultado = await executarQuery(sql, [`%${nome}%`]);

    // Adiciona imagens a cada carro
    const resultadoComImagens = await Promise.all(resultado.map(async (carro) => {
      const imagens = await apresentarImagemPorIdAnuncio(carro.id);
      return {
        ...carro,
        imagens: imagens.map(img => img.id)
      };
    }));

    return resultadoComImagens;
  } catch (error) {
    throw new AppError('Erro ao buscar carro por nome.', 500, 'CARRO_NAME_ERROR', error.message);
  }
}

export { apresentarCarro, apresentarCarroPorId, apresentarCarroPorNome };