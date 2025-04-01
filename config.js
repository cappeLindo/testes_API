import mysql from "mysql2/promise"

const pool = mysql.createPool({
    host: 'localhost',
    user: 'user',
    password: '12345',
    database: 'web-cars'
})

export default pool;