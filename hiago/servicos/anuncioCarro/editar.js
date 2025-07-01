import pool from '../../../config.js';
import AppError from '../../utils/AppError.js';
import { adicionarImagem } from '../imagensCarro/adicionar.js';
import { deletarImagem, deletarImagemAnuncio } from '../imagensCarro/deletar.js';

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

async function editarAnuncioCarro(dados, imagens) {
  const {
    nome, ano, condicao, valor, ipva_pago, data_ipva, data_compra, detalhes_veiculo, blindagem, quilometragem,
    cor_id, aro_id, categoria_id, marca_id, modelo_id, combustivel_id, cambio_id, id
  } = dados;

  try {
    id = parseInt(id, 10);
    const sql = `
      UPDATE carro SET
        nome = ?, ano = ?, condicao = ?, valor = ?, ipva_pago = ?, data_ipva = ?,
        data_compra = ?, detalhes_veiculo = ?, blindagem = ?, quilometragem = ?, cor_id = ?, aro_id = ?,
        categoria_id = ?, marca_id = ?, modelo_id = ?, combustivel_id = ?, cambio_id = ?
      WHERE id = ?
    `;
    const params = [
      nome, ano, condicao, valor, ipva_pago, data_ipva, data_compra, detalhes_veiculo, blindagem, quilometragem,
      cor_id, aro_id, categoria_id, marca_id, modelo_id, combustivel_id, cambio_id, id
    ];

    const resultado = await executarQuery(sql, params);
    await deletarImagemAnuncio(id);
    for (const [i, file] of imagens.entries()) {
      const nomeFinal = `${Date.now()}-${i}-${file.originalname}`;
      await adicionarImagem(nomeFinal, id, file.buffer);
    }

    return resultado;
  } catch (error) {
    throw new AppError('Erro ao editar carro.', 500, 'CARRO_EDIT_ERROR', error.message);
  }
}

async function editarAnuncioCarroParcial(id, camposAtualizar, imagens, imagensExcluidas) {
  try {
    id = parseInt(id, 10);
    const campos = Object.keys(camposAtualizar).map(campo => `${campo} = ?`).join(', ');
    const valores = Object.values(camposAtualizar);
    const sql = `UPDATE carro SET ${campos} WHERE id = ?`;
    const params = [...valores, id];

    const resultado = await executarQuery(sql, params);

    if (imagensExcluidas) {
      let imagensArray;
      try {
        if (Array.isArray(imagensExcluidas)) {
          imagensArray = imagensExcluidas;
        } else if (typeof imagensExcluidas === 'string') {
          imagensArray = JSON.parse(imagensExcluidas);
        } else {
          throw new AppError('Formato inválido para imagensExcluidas.', 400, 'INVALID_JSON');
        }

        for (const imagemId of imagensArray) {
          if (!isNaN(imagemId)) await deletarImagem(imagemId);
        }
      } catch {
        throw new AppError('Formato inválido para imagensExcluidas.', 400, 'INVALID_JSON');
      }
    }

    if (imagens && imagens.length > 0) {
      for (const [i, file] of imagens.entries()) {
        const nomeFinal = `${Date.now()}-${i}-${file.originalname}`;
        await adicionarImagem(nomeFinal, id, file.buffer);
      }
    }

    return resultado;
  } catch (error) {
    throw new AppError('Erro ao editar carro parcialmente.', 500, 'CARRO_PATCH_ERROR', error.message);
  }
}

export { editarAnuncioCarro, editarAnuncioCarroParcial };