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

async function adicionarImagem(nome, id) {
    try{
        const sql = `INSERT INTO imagensCarro (nome_imagensCarro, anuncioCarro_id_anuncioCarro) VALUE (?, ?);`;
        return await executarQuery(sql, [nome, id]);
    } catch(error) {
        throw new AppError('ID do anucio é invalido', 400, 'ANUNCIO_ID_INVALID', error.message);
    }
    
}

export { adicionarImagem }