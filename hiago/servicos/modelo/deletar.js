import pool from '../../../config.js';
import AppError from '../../utils/AppError.js';
let codigoErro;

async function executarQuery(sql, params = []) {
    let conexao;
    try {
        conexao = await pool.getConnection();
        //console.log('Executando SQL:', sql, 'com params:', params); // DEBUG
        const [resultado] = await conexao.execute(sql, params);
        return resultado;
    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === 'ER_ROW_IS_REFERENCED') {
            codigoErro = 409;
            throw new AppError(
                'Não é possível excluir o registro porque ele está sendo referenciado por outros dados.',
                codigoErro,
                'FOREIGN_KEY_CONSTRAINT',
                error.message
            );
        }
        codigoErro = 500;
        throw new AppError('Erro ao executar o comando', codigoErro, 'DB_EXEC_ERROR', error.message);
    } finally {
        if (conexao) conexao.release();
    }
}

async function deletarModelo(id) {
    try {
        const sql = "DELETE FROM modelo WHERE id = ?";
        const resultado = await executarQuery(sql, [id]);
        return resultado;
    } catch (error) {
        throw new AppError('Erro ao deletar modelo', codigoErro, 'MODELO_DELETE_ERROR', error.message);
    }
}

export { deletarModelo }
