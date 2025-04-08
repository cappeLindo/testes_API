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

async function adicionarCambio(nome) {
    try{
        const sql = `INSERT INTO cambio (nome_cambio) VALUE (?);`;
        return await executarQuery(sql, [nome]);
    } catch(error) {
        throw new AppError('ID do câmbio é invalido', 400, 'CAMBIO_ID_INVALID', error.message);
    }
    
}

export { adicionarCambio }