import pool from '../../../config.js';
import AppError from '../../utils/AppError.js';
import { adicionarImagem } from '../imagensCarro/adicionar.js';

async function executarQuery(sql, params = []) {
  let conexao;
  try {
    conexao = await pool.getConnection();
    console.log(sql, params)
    const [resultado] = await conexao.execute(sql, params);
    return resultado;
  } catch (error) {
    throw new AppError('Erro ao executar o comando', 500, 'DB_EXEC_ERROR', error.message);
  } finally {
    if (conexao) conexao.release();
  }
}

async function adicionarCarro(dados, imagens) {
  const {
    nome, ano, condicao, valor, ipva_pago, data_ipva, data_compra, detalhes_veiculo, blindagem, quilometragem,
    cor_id, aro_id, categoria_id, marca_id, modelo_id, combustivel_id, cambio_id, idConcessionaria
  } = dados;
  try {
    const sql = `
      INSERT INTO carro (
        nome, ano, condicao, valor, ipva_pago, data_ipva, data_compra, detalhes_veiculo, blindagem, quilometragem,
        cor_id, aro_id, categoria_id, marca_id, modelo_id, combustivel_id, cambio_id, concessionaria_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      nome,
      ano,
      condicao,
      valor,
      ipva_pago ? 1 : 0,
      data_ipva || null,
      data_compra || null,
      detalhes_veiculo,
      blindagem ? 1 : 0,
      String(quilometragem),
      cor_id,
      aro_id,
      categoria_id,
      marca_id,
      modelo_id,
      combustivel_id,
      cambio_id,
      idConcessionaria
    ];

    const resultado = await executarQuery(sql, params);
    if (resultado.affectedRows === 0) {
      throw new AppError('Erro ao cadastrar carro.', 500, 'CARRO_INSERT_ERROR');
    }

    for (const [i, file] of imagens.entries()) {
      const nomeFinal = `${Date.now()}-${i}-${file.originalname}`;
      await adicionarImagem(nomeFinal, resultado.insertId, file.buffer);
    }

    return resultado;
  } catch (error) {
    throw new AppError('Erro ao cadastrar carro.', 500, 'CARRO_INSERT_ERROR', error.message);
  }
}

export { adicionarCarro };