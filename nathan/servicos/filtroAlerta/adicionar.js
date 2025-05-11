import pool from '../../../../config.js';

export async function adicionarFiltroAlerta(dados) {
    const [resultado] = await pool.query('INSERT INTO filtroAlerta SET ?', [dados]);
    return resultado;
}