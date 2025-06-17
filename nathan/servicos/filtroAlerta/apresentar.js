import pool from '../../../config.js';

const baseQuery = `SELECT ac.id, ac.nome AS alerta_nome, ac.modelo_id, m.nome AS modelo_nome, ac.marca_id, ma.nome AS marca_nome, ac.categoria_id, c.nome AS categoria_nome, ac.cor_id, co.nome AS cor_nome, ac.aro_id, a.nome AS aro_nome, ac.combustivel_id, cb.nome AS combustivel_nome, ac.cambio_id, ca.nome AS cambio_nome, ac.cliente_id, cs.nome AS cliente_nome FROM webcars_db.filtroAlerta ac INNER JOIN webcars_db.modelo m ON ac.modelo_id = m.id INNER JOIN webcars_db.marca ma ON ac.marca_id = ma.id INNER JOIN webcars_db.categoria c ON ac.categoria_id = c.id INNER JOIN webcars_db.cor co ON ac.cor_id = co.id INNER JOIN webcars_db.aro a ON ac.aro_id = a.id INNER JOIN webcars_db.combustivel cb ON ac.combustivel_id = cb.id INNER JOIN webcars_db.cambio ca ON ac.cambio_id = ca.id INNER JOIN webcars_db.cliente cs ON ac.cliente_id = cs.id`;

export async function apresentarFiltroAlerta() {
  const [resultado] = await pool.query(baseQuery);
  return resultado;
}

export async function apresentarFiltroAlertaPorID(id) {
  const [resultado] = await pool.query(`${baseQuery} WHERE ac.id = ?`, [id]);
  return resultado;
}

export async function apresentarFiltroAlertaPorNome(nome) {
  const [resultado] = await pool.query(`${baseQuery} WHERE ac.nome LIKE ?`, [`%${nome}%`]);
  return resultado;
}

export async function apresentarFiltroAlertaPorIDcleinte(id) {
  const [resultado] = await pool.query(`${baseQuery} WHERE ac.cliente_id = ?`, [id]);
  return resultado;
}
