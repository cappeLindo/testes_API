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

export async function deletarFiltroAlerta(id) {
    try {
        const sql = `DELETE FROM filtroAlerta WHERE id = ?`;
        return await executarQuery(sql, [id]);
    } catch (error) {
        throw new AppError('Erro ao deletar filtro de alerta', 500, 'FILTRO_ALERTA_DELETE_ERROR', error.message);
    }
}
