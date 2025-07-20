import pool from '../../../config.js';

async function executarQuery(sql, params = []) {
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

const sqlPadrao = `SELECT 
    fa.id, 
    fa.nome AS alerta_nome, 
    fa.cliente_id, 
    cs.nome AS cliente_nome, 
    fa.modelo_id, 
    m.nome AS modelo_nome, 
    fa.marca_id, 
    ma.nome AS marca_nome, 
    fa.categoria_id, 
    c.nome AS categoria_nome, 
    fa.cor_id, 
    co.nome AS cor_nome, 
    fa.aro_id, 
    a.nome AS aro_nome, 
    fa.combustivel_id, 
    cb.nome AS combustivel_nome, 
    fa.cambio_id, 
    ca.nome AS cambio_nome, 
    fa.ano, 
    fa.condicao, 
    fa.ipva_pago, 
    fa.blindagem, 
    fa.data_ipva, 
    fa.data_compra, 
    fa.valor_maximo, 
    fa.valor_minimo,
    CONVERT_TZ(fa.criado_em, '+00:00', '-03:00') AS criado_em_brasil,
    CONVERT_TZ(fa.atualizado_em, '+00:00', '-03:00') AS atualizado_em_brasil
FROM 
    webcars_db.filtroAlerta fa 
    INNER JOIN webcars_db.cliente cs ON fa.cliente_id = cs.id 
    LEFT JOIN webcars_db.modelo m ON fa.modelo_id = m.id 
    LEFT JOIN webcars_db.marca ma ON fa.marca_id = ma.id 
    LEFT JOIN webcars_db.categoria c ON fa.categoria_id = c.id 
    LEFT JOIN webcars_db.cor co ON fa.cor_id = co.id 
    LEFT JOIN webcars_db.aro a ON fa.aro_id = a.id 
    LEFT JOIN webcars_db.combustivel cb ON fa.combustivel_id = cb.id 
    LEFT JOIN webcars_db.cambio ca ON fa.cambio_id = ca.id`;


export async function apresentarFiltroAlerta() {
  try {
    const sql = sqlPadrao;
    return await executarQuery(sql);
  } catch (error) {
    throw new AppError('Erro ao apresentar filtros de alerta', 500, 'FILTRO_ALERTA_LIST_ERROR', error.message);
  }
}

export async function apresentarFiltroAlertaPorID(id) {
  if (!id) {
    throw new AppError('ID do filtro de alerta é obrigatório', 400, 'MISSING_ID');
  }
  try {
    const sql = `${sqlPadrao} WHERE fa.id = ?`;
    return await executarQuery(sql, [id]);
  } catch (error) {
    throw new AppError('Erro ao buscar filtro de alerta por ID', 500, 'FILTRO_ALERTA_ID_ERROR', error.message);
  }
}

export async function apresentarFiltroAlertaPorNome(nome) {
  if (!nome) {
    throw new AppError('Nome do filtro de alerta é obrigatório', 400, 'MISSING_NAME');
  }
  try {
    const sql = `${sqlPadrao} WHERE fa.nome LIKE ?`;
    return await executarQuery(sql, [`%${nome}%`]);
  } catch (error) {
    throw new AppError('Erro ao buscar filtro de alerta por nome', 500, 'FILTRO_ALERTA_NAME_ERROR', error.message);
  }
}

export async function apresentarFiltroAlertaPorIDcleinte(id) {
  if (!id) {
    throw new AppError('ID do cliente é obrigatório', 400, 'MISSING_ID');
  }
  try {
    const sql = `${sqlPadrao} WHERE fa.cliente_id = ?`;
    return await executarQuery(sql, [id]);
  } catch (error) {
    throw new AppError('Erro ao buscar filtro de alerta por ID do cliente', 500, 'FILTRO_ALERTA_CLIENTE_ID_ERROR', error.message);
  }
}

export async function compararCarroComFiltros(idCarro) {
  if (!idCarro) {
    throw new AppError('ID do carro é obrigatório.', 400, 'MISSING_CAR_ID');
  }

  try {
    // 1. Buscar dados do carro
    const carroSql = `
      SELECT * FROM webcars_db.carro WHERE id = ?
    `;
    const [carro] = await executarQuery(carroSql, [idCarro]);

    if (!carro) {
      throw new AppError('Carro não encontrado.', 404, 'CAR_NOT_FOUND');
    }

    // 2. Buscar todos os filtros e dados do cliente
    const filtrosSql = `
      SELECT fa.*, cs.nome AS cliente_nome, cs.email AS cliente_email
      FROM webcars_db.filtroAlerta fa
      INNER JOIN webcars_db.cliente cs ON fa.cliente_id = cs.id
    `;
    const filtros = await executarQuery(filtrosSql);

    const comparacoes = filtros.map(filtro => {
      let totalCampos = 0;
      let camposIguais = 0;

      // Lista de campos comparáveis entre carro e filtro
      const camposComparaveis = [
        'ano', 'condicao', 'ipva_pago', 'blindagem', 'modelo_id',
        'combustivel_id', 'aro_id', 'categoria_id', 'marca_id',
        'cambio_id', 'cor_id'
      ];

      camposComparaveis.forEach(campo => {
        if (filtro[campo] !== null && filtro[campo] !== undefined) {
          totalCampos++;
          if (String(filtro[campo]) === String(carro[campo])) {
            camposIguais++;
          }
        }
      });

      // Verificação de valor entre mínimo e máximo
      if (filtro.valor_minimo !== null || filtro.valor_maximo !== null) {
        totalCampos++;
        const precoOk =
          (filtro.valor_minimo === null || carro.valor >= filtro.valor_minimo) &&
          (filtro.valor_maximo === null || carro.valor <= filtro.valor_maximo);
        if (precoOk) camposIguais++;
      }

      // Percentual de compatibilidade
      const porcentagem = totalCampos > 0 ? Math.round((camposIguais / totalCampos) * 100) : 0;

      return {
        filtro_id: filtro.id,
        nome_filtro: filtro.nome,
        cliente_nome: filtro.cliente_nome,
        cliente_email: filtro.cliente_email,
        porcentagem_similaridade: porcentagem,
        filtro
      };
    });

    // Ordenar em ordem decrescente de compatibilidade
    comparacoes.sort((a, b) => b.porcentagem_similaridade - a.porcentagem_similaridade);

    return comparacoes;
  } catch (error) {
    throw new AppError('Erro ao comparar carro com filtros.', 500, 'CAR_FILTER_MATCH_ERROR', error.message);
  }
}