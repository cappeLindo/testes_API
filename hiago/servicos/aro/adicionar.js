import pool from '../../../config.js';
import AppError from '../../utils/AppError.js';

async function executarQuery(sql, params = []) {
    let conexao;
    try {
        conexao = await pool.getConnection();
        const [resultado] = await conexao.execute(sql, params);
        return resultado.length > 0 ? resultado : [];
    } catch (error) {
        console.error('Erro ao executar query:', error);
        throw error;
    } finally {
        if (conexao) conexao.release();
    }
}

async function adicionarCadastro(nome, email, telefone, funcao) {
    const sql = `INSERT INTO cadastros (nome, email, telefone, funcao) VALUES (?, ?, ?, ?);`;
    return await executarQuery(sql, [nome, email, telefone, funcao]);
}

export { adicionarCadastro }