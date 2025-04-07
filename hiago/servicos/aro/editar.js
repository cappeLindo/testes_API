import pool from '../../../config.js';
import AppError from '../../utils/AppError.js';

async function executarQuery(sql, params = []) {
    let conexao;
    try {
        conexao = await pool.getConnection();
        const [resultado] = await conexao.execute(sql, params);
        return resultado;
    } catch (error) {
        console.error('Erro ao executar query:', error);
        throw error;
    } finally {
        if (conexao) conexao.release();
    }
}

async function editarCadastro(id, nome, email, telefone, funcao) {
    const sql = `UPDATE cadastros SET nome = ?, email = ?, telefone = ?, funcao = ? WHERE id = ?;`;
    return await executarQuery(sql, [nome, email, telefone, funcao, id]);
}

async function editarCadastroParcial(id, campos) {
    const colunas = Object.keys(campos).map(campo => `${campo} = ?`).join(", ");
    const valores = Object.values(campos);
    const sql = `UPDATE cadastros SET ${colunas} WHERE id = ?`
    valores.push(id);
    return await executarQuery(sql, valores);
}

export { editarCadastro, editarCadastroParcial }