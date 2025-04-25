import mysql from "mysql2/promise"

const pool = mysql.createPool({
    host: '200.129.130.149',
    port : 20002,
    user: 'webcars',
    password: '12345678',
    database: 'webcars_db'
})

export default pool;