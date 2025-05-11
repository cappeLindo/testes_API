import pool from '../../../../config.js';

const baseQuery = `
    SELECT fa.*, 
           co.nome_cor, cb.nome_cambio, a.nome_aro,
           cat.nome_categoria, m.nome_marca,
           comb.nome_combustivel, cl.nome_cliente,
           mod.nome_modelo
    FROM filtroAlerta fa
    LEFT JOIN cor co ON fa.cor_id_cor = co.id_cor
    LEFT JOIN cambio cb ON fa.cambio_id_cambio = cb.id_cambio
    LEFT JOIN aro a ON fa.aro_id_aro = a.id_aro
    LEFT JOIN categoria cat ON fa.categoria_id_categoria = cat.id_categoria
    LEFT JOIN marca m ON fa.marca_id_marca = m.id_marca
    LEFT JOIN combustivel comb ON fa.combustivel_id_combustivel = comb.id_combustivel
    LEFT JOIN cliente cl ON fa.cliente_id_cliente = cl.id_cliente
    LEFT JOIN modelo mod ON fa.modelo_id_modelo = mod.id_modelo
`;

export async function apresentarFiltroAlerta() {
    const [resultado] = await pool.query(baseQuery);
    return resultado;
}

export async function apresentarFiltroAlertaPorID(id) {
    const [resultado] = await pool.query(`${baseQuery} WHERE fa.id_filtroAlerta = ?`, [id]);
    return resultado;
}

export async function apresentarFiltroAlertaPorNome(nome) {
    const [resultado] = await pool.query(`${baseQuery} WHERE fa.nome_filtroAlerta LIKE ?`, [`%${nome}%`]);
    return resultado;
}