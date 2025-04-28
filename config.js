import mysql from "mysql2/promise"

const pool = mysql.createPool({
    host: 'icskko8k08w0ss88kws80s0o',
    port : 3306,
    user: 'webcars',
    password: '12345678',
    database: 'webcars_db'
})

export default pool;