import pool from '../../../config.js';
import AppError from '../../utils/AppError.js';
import { apresentarImagemPorIdAnuncio } from '../imagensCarro/apresentar.js';

export async function executarQuery(sql, params = []) {
  let conexao;
  try {
    conexao = await pool.getConnection();
    const [resultado] = await conexao.execute(sql, params);
    return resultado;
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === 'ER_ROW_IS_REFERENCED') {
      throw new AppError(
        'Não é possível excluir o registro porque ele está sendo referenciado por outros dados.',
        409,
        'FOREIGN_KEY_CONSTRAINT',
        error.message
      );
    }
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
    c.cor_id, 
    co.nome AS cor_nome, 
    c.aro_id, 
    a.nome AS aro_nome, 
    c.categoria_id, 
    cat.nome AS categoria_nome, 
    c.marca_id, 
    m.nome AS marca_nome, 
    c.modelo_id, 
    mod.nome AS modelo_nome, 
    c.combustivel_id, 
    comb.nome AS combustivel_nome, 
    c.cambio_id, 
    cam.nome AS cambio_nome, 
    c.concessionaria_id, 
    conc.nome AS concessionaria_nome 
  FROM 
    webcars_db.carro c 
    INNER JOIN webcars_db.concessionaria conc ON c.concessionaria_id = conc.id 
    LEFT JOIN webcars_db.cor co ON c.cor_id = co.id 
    LEFT JOIN webcars_db.aro a ON c.aro_id = a.id 
    LEFT JOIN webcars_db.categoria cat ON c.categoria_id = cat.id 
    LEFT JOIN webcars_db.marca m ON c.marca_id = m.id 
    LEFT JOIN webcars_db.modelo mod ON c.modelo_id = mod.id 
    LEFT JOIN webcars_db.combustivel comb ON c.combustivel_id = comb.id 
    LEFT JOIN webcars_db.cambio cam ON c.cambio_id = cam.id
`;

export async function apresentarCarro() {
  try {
    const resultado = await executarQuery(sqlPadrao);
    // Adiciona as imagens associadas a cada carro
    const resultadoComImagens = await Promise.all(resultado.map(async (carro) => {
      const imagens = await apresentarImagemPorIdAnuncio(carro.id);
      return {
        ...carro,
        imagens: imagens.map(img => img.id)
      };
    }));
    return resultadoComImagens.length > 0 ? resultadoComImagens : [];
  } catch (error) {
    throw new AppError('Erro ao apresentar carros', 500, 'CARRO_LIST_ERROR', error.message);
  }
}

export async function apresentarCarroPorId(id) {
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
    const imagens = await apresentarImagemPorIdAnuncio(id);
    return {
      ...carro,
      imagens: imagens.map(img => img.id)
    };
  } catch (error) {
    throw new AppError('Erro ao buscar carro por ID', 500, 'CARRO_ID_ERROR', error.message);
  }
}

export async function apresentarCarroPorNome(nome) {
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
    return resultadoComImagens.length > 0 ? resultadoComImagens : [];
  } catch (error) {
    throw new AppError('Erro ao buscar carro por nome', 500, 'CARRO_NAME_ERROR', error.message);
  }
}