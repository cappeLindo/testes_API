import pool from '../../../config.js';

export async function deletarFiltroAlerta(id) {
    const [resultado] = await pool.query('DELETE FROM filtroAlerta WHERE id_filtroAlerta = ?', [id]);
    return resultado;
}