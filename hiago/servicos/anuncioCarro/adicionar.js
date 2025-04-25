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

async function adicionarCarro(nomeCarro, anoCarro, condicaoCarro, valorCarro, ipvaPago, dataIpva, dataCompra, detalhesVeiculo, blindagem, idCor, idAro, idCategoria, idMarca, idModelo, idCombustivel, idCambio, idConcessionaria) {
    try{
        const sql = `INSERT INTO \`webcars_db\`.\`anuncioCarro\`
        (\`nome_anuncioCarro\`, \`ano\`, \`condicao\`, \`valor\`, \`ipva_pago\`, \`data_ipva\`,
         \`data_compra\`, \`detalhes_veiculo\`, \`blindagem\`, \`cor_id_cor\`, \`aro_id_aro\`,
         \`categoria_id_categoria\`, \`marca_id_marca\`, \`modelo_id_modelo\`, 
         \`combustivel_id_combustivel\`, \`cambio_id_cambio\`, \`concessionaria_id_concessionaria\`)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
        return await executarQuery(sql, [nomeCarro, anoCarro, condicaoCarro, valorCarro, ipvaPago, dataIpva, dataCompra, detalhesVeiculo, blindagem, idCor, idAro, idCategoria, idMarca, idModelo, idCombustivel, idCambio, idConcessionaria]);
    } catch(error) {
        throw new AppError('Erro ao cadastrar carro', 400, 'CARRO_ERROR_POST', error.message);
    }
    
}

export { adicionarCarro }