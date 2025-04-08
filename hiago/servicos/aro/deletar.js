import pool from '../../../config.js';
import AppError from '../../utils/AppError.js';

async function executarQuery(sql, params = []) {
    let conexao;
    try {
        conexao = await pool.getConnection();
        //console.log('Executando SQL:', sql, 'com params:', params); // DEBUG
        const [resultado] = await conexao.execute(sql, params);
        return resultado;
    } catch (error) {
        throw new AppError('Erro ao executar o comando', 500, 'DB_EXEC_ERROR', error.message);
    } finally {
        if (conexao) conexao.release();
    }
}

async function deletarAro(id) {
    try {
        id = parseInt(id, 10); // Garantindo que id seja um número inteiro
        const sql = "DELETE FROM aro WHERE id_aro = ?";
        const resultado = await executarQuery(sql, [id]);
        return resultado;
    } catch (error) {
        throw new AppError('Erro ao deletar aro', 500, 'ARO_DELETE_ERROR', error.message);
    }
}

export { deletarAro }
