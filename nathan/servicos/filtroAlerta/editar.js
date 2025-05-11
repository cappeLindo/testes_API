import pool from '../../../../config.js';

export async function editarFiltroAlerta(id, dados) {
    const [resultado] = await pool.query('UPDATE filtroAlerta SET ? WHERE id_filtroAlerta = ?', [dados, id]);
    return resultado;
}

export async function editarFiltroAlertaParcial(id, dados) {
    return editarFiltroAlerta(id, dados);
}