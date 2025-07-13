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

const sqlPadrao = `
  SELECT 
    c.id, 
    c.nome AS carro_nome, 
    c.ano, 
    c.condicao, 
    c.valor, 
    c.ipva_pago, 
    c.data_ipva, 
    c.data_compra, 
    c.detalhes_veiculo, 
    c.blindagem, 
    c.quilometragem,
    c.cor_id, 
    co.nome AS cor_nome, 
    c.aro_id, 
    a.nome AS aro_name, 
    c.categoria_id, 
    cat.nome AS categoria_name, 
    c.marca_id, 
    m.nome AS marca_name, 
    c.modelo_id, 
    md.nome AS modelo_name, 
    c.combustivel_id, 
    comb.nome AS combustivel_name, 
    c.cambio_id, 
    cam.nome AS cambio_nome, 
    c.concessionaria_id, 
    conc.nome AS concessionaria_name 
  FROM 
    webcars_db.carro c 
    INNER JOIN webcars_db.concessionaria conc ON c.concessionaria_id = conc.id 
    LEFT JOIN webcars_db.cor co ON c.cor_id = co.id 
    LEFT JOIN webcars_db.aro a ON c.aro_id = a.id 
    LEFT JOIN webcars_db.categoria cat ON c.categoria_id = cat.id 
    LEFT JOIN webcars_db.marca m ON c.marca_id = m.id 
    LEFT JOIN webcars_db.modelo md ON c.modelo_id = md.id 
    LEFT JOIN webcars_db.combustivel comb ON c.combustivel_id = comb.id 
    LEFT JOIN webcars_db.cambio cam ON c.cambio_id = cam.id
`;

async function apresentarCarro() {
  try {
    const resultado = await executarQuery(sqlPadrao);
    const resultadoComImagens = await Promise.all(resultado.map(async (carro) => {
      const imagens = await apresentarImagemPorIdAnuncio(carro.id);
      return {
        ...carro,
        imagens: imagens.map(img => img.id)
      };
    }));
    return resultadoComImagens;
  } catch (error) {
    throw new AppError('Erro ao apresentar carros', 500, 'CARRO_LIST_ERROR', error.message);
  }
}

async function apresentarCarroPorId(id) {
  if (!id || isNaN(id)) {
    throw new AppError('ID do carro é obrigatório e deve ser um número', 400, 'MISSING_ID');
  }
  try {
    const sql = `${sqlPadrao} WHERE c.id = ?`;
    const resultado = await executarQuery(sql, [id]);
    if (!resultado.length) {
      return null;
    }
    const carro = resultado[0];
    const imagens = await apresentarImagemPorIdAnuncio(carro.id);
    return {
      ...carro,
      imagens: imagens.map(img => img.id)
    };
  } catch (error) {
    throw new AppError('Erro ao buscar carro por ID', 500, 'CARRO_ID_ERROR', error.message);
  }
}

async function apresentarCarroPorNome(nome) {
  if (!nome || typeof nome !== 'string') {
    throw new AppError('Nome do carro é obrigatório e deve ser uma string', 400, 'MISSING_NAME');
  }
  try {
    const sql = `${sqlPadrao} WHERE c.nome LIKE ?`;
    const resultado = await executarQuery(sql, [`%${nome}%`]);
    const resultadoComImagens = await Promise.all(resultado.map(async (carro) => {
      const imagens = await apresentarImagemPorIdAnuncio(carro.id);
      return {
        ...carro,
        imagens: imagens.map(img => img.id)
      };
    }));
    return resultadoComImagens;
  } catch (error) {
    throw new AppError('Erro ao buscar carro por nome', 500, 'CARRO_NAME_ERROR', error.message);
  }
}

async function apresentarCarrosPorConcessionaria(idConcessionaria) {
  if (!idConcessionaria || isNaN(idConcessionaria)) {
    throw new AppError('ID da concessionária é obrigatório e deve ser um número', 400, 'INVALID_CONCESSIONARIA_ID');
  }

  try {
    const sql = `${sqlPadrao} WHERE c.concessionaria_id = ?`;
    const resultado = await executarQuery(sql, [idConcessionaria]);
    const resultadoComImagens = await Promise.all(resultado.map(async (carro) => {
      const imagens = await apresentarImagemPorIdAnuncio(carro.id);
      return {
        ...carro,
        imagens: imagens.map(img => img.id)
      };
    }));
    return resultadoComImagens;
  } catch (error) {
    throw new AppError('Erro ao buscar carros por concessionária', 500, 'CARRO_CONCESSIONARIA_ERROR', error.message);
  }
}

// Exportar a nova função
export { apresentarCarro, apresentarCarroPorId, apresentarCarroPorNome, apresentarCarrosPorConcessionaria };