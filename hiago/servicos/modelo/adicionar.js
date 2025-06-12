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

async function adicionarModelo(nome, id_marca, id_categoria) {
    try{
        const sql = `INSERT INTO modelo (nome, marca_id, categoria_id) VALUE (?, ?, ?);`;
        return await executarQuery(sql, [nome, id_marca, id_categoria]);
    } catch(error) {
        throw new AppError('Valores são invalidos', 400, 'MODELO_VALUE_INVALID', error.message);
    }
    
}

export { adicionarModelo }