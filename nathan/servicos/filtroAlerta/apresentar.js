import pool from '../../../config.js';

const baseQuery = "SELECT ac.id_filtroAlerta, ac.nome_filtroAlerta, ac.modelo_id_modelo, m.nome_modelo, ac.marca_id_marca, ma.nome_marca, ac.categoria_id_categoria, c.nome_categoria, ac.cor_id_cor, co.nome_cor, ac.aro_id_aro, a.nome_aro, ac.combustivel_id_combustivel, cb.nome_combustivel, ac.cambio_id_cambio, ca.nome_cambio, ac.cliente_id_cliente, cs.nome_cliente FROM `webcars_db`.filtroAlerta ac INNER JOIN `webcars_db`.modelo m ON ac.modelo_id_modelo = m.id_modelo INNER JOIN `webcars_db`.marca ma ON ac.marca_id_marca = ma.id_marca INNER JOIN `webcars_db`.categoria c ON ac.categoria_id_categoria = c.id_categoria INNER JOIN `webcars_db`.cor co ON ac.cor_id_cor = co.id_cor INNER JOIN `webcars_db`.aro a ON ac.aro_id_aro = a.id_aro INNER JOIN `webcars_db`.combustivel cb ON ac.combustivel_id_combustivel = cb.id_combustivel INNER JOIN `webcars_db`.cambio ca ON ac.cambio_id_cambio = ca.id_cambio INNER JOIN `webcars_db`.cliente cs ON ac.cliente_id_cliente = cs.id_cliente"

export async function apresentarFiltroAlerta() {
    const [resultado] = await pool.query(baseQuery);
    return resultado;
}

export async function apresentarFiltroAlertaPorID(id) {
    const [resultado] = await pool.query(`${baseQuery} WHERE ac.id_filtroAlerta = ?`, [id]);
    return resultado;
}

export async function apresentarFiltroAlertaPorNome(nome) {
    const [resultado] = await pool.query(`${baseQuery} WHERE ac.nome_filtroAlerta LIKE ?`, [`%${nome}%`]);
    return resultado;
}

export async function apresentarFiltroAlertaPorIDcleinte(id) {
    const [resultado] = await pool.query(`${baseQuery} WHERE ac.cliente_id_cliente = ?`, [id]);
    return resultado;
}