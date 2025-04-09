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

async function adicionarCor(nome) {
    try{
        const sql = `INSERT INTO cor (nome_cor) VALUE (?);`;
        return await executarQuery(sql, [nome]);
    } catch(error) {
        throw new AppError('ID da cor é invalido', 400, 'COR_ID_INVALID', error.message);
    }
    
}

export { adicionarCor }