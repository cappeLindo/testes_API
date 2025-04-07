import pool from '../../../config.js';
import AppError from '../../utils/AppError.js';

async function executarQuery(sql, params = []) {
    let conexao;
    try {
        conexao = await pool.getConnection();
        const [resultado] = await conexao.execute(sql, params);
        console.log(resultado)
        return resultado;
    } catch (error) {
        console.error('Erro ao executar query:', error);
        throw error;
    } finally {
        if (conexao) conexao.release();
    }
}

async function deletarCadastro(id) {
    const sql = `DELETE FROM cadastros WHERE id = ?;`;
    return await executarQuery(sql, [id]);
}

export { deletarCadastro }
