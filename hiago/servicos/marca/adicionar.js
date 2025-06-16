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

async function adicionarMarca(nome) {
    try{
        const sql = `INSERT INTO marca (nome) VALUE (?);`;
        return await executarQuery(sql, [nome]);
    } catch(error) {
        throw new AppError('ID da marca é invalido', 400, 'MARCA_ID_INVALID', error.message);
    }
    
}

export { adicionarMarca }