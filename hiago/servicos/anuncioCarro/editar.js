import pool from '../../../config.js';
import AppError from '../../utils/AppError.js';

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

async function editarAnuncioCarro(nomeCarro, anoCarro, condicaoCarro, valorCarro,
  ipvaPago, dataIpva, dataCompra, detalhesVeiculo, blindagem,
  idCor, idAro, idCategoria, idMarca, idModelo,
  idCombustivel, idCambio, id) {
  try {
    const sql = "UPDATE anuncioCarro SET nome_anuncioCarro = ?, ano = ?, condicao = ?, valor = ?, ipva_pago = ?, data_ipva = ?, data_compra = ?, detalhes_veiculo = ?, blindagem = ?, cor_id_cor = ?, aro_id_aro = ?, categoria_id_categoria = ?, marca_id_marca = ?, modelo_id_modelo = ?, combustivel_id_combustivel = ?, cambio_id_cambio = ? WHERE id_anuncioCarro = ?;";
    const resultado = await executarQuery(sql, [nomeCarro, anoCarro, condicaoCarro, valorCarro,
      ipvaPago, dataIpva, dataCompra, detalhesVeiculo, blindagem,
      idCor, idAro, idCategoria, idMarca, idModelo,
      idCombustivel, idCambio, id]);

    console.log('Resultado da edição do anuncioCarro:', resultado); // DEBUG
    return resultado;
  } catch (error) {
    throw new AppError('Erro ao editar carro', 400, 'CARRO_EDIT_ERROR', error.message);
  }
}

async function editarAnuncioCarroParcial(id, campos) {
  const colunas = Object.keys(campos).map(campo => `${campo} = ?`).join(", ");
  const valores = Object.values(campos);
  const sql = `UPDATE anuncioCarro SET ${colunas} WHERE id_anuncioCarro = ?`
  valores.push(id);
  return await executarQuery(sql, valores);
}


export { editarAnuncioCarro, editarAnuncioCarroParcial };