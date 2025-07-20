import pool from '../../../config.js';
import AppError from '../../utils/AppError.js';
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

export async function editarFiltroAlerta(id, dados) {
    try {
        const sql = `UPDATE filtroAlerta SET 
                     nome = ?, cliente_id = ?, ano = ?, condicao = ?, ipva_pago = ?, blindagem = ?, 
                     data_ipva = ?, data_compra = ?, valor_maximo = ?, valor_minimo = ?, 
                     marca_id = ?, categoria_id = ?, cambio_id = ?, aro_id = ?, modelo_id = ?, 
                     combustivel_id = ?, cor_id = ? 
                     WHERE id = ?`;
        const params = [
            dados.nome || null,
            dados.cliente_id || null,
            dados.ano || null,
            dados.condicao || null,
            dados.ipva_pago || null,
            dados.blindagem || null,
            dados.data_ipva || null,
            dados.data_compra || null,
            dados.valor_maximo || null,
            dados.valor_minimo || null,
            dados.marca_id || null,
            dados.categoria_id || null,
            dados.cambio_id || null,
            dados.aro_id || null,
            dados.modelo_id || null,
            dados.combustivel_id || null,
            dados.cor_id || null,
            id
        ];
        return await executarQuery(sql, params);
    } catch (error) {
        throw new AppError('Erro ao editar filtro de alerta', 400, 'FILTRO_ALERTA_EDIT_ERROR', error.message);
    }
}

export async function editarFiltroAlertaParcial(id, campos) {
    try {
        const colunas = Object.keys(campos).map(campo => `${campo} = ?`).join(", ");
        const valores = Object.values(campos);
        const sql = `UPDATE filtroAlerta SET ${colunas} WHERE id = ?`;
        valores.push(id);
        return await executarQuery(sql, valores);
    } catch (error) {
        throw new AppError('Erro ao editar parcialmente filtro de alerta', 400, 'FILTRO_ALERTA_PARTIAL_EDIT_ERROR', error.message);
    }
}