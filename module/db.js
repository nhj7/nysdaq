const db = require('mariadb');
require('dotenv').config();

// 설정된 환경으로 config 적용.
const pool = db.createPool({
    host: process.env.DB_HOST
    , port:process.env.DB_PORT
    , user: process.env.DB_ID
    , password: process.env.DB_PASSWORD
    , database: "nysdaq"
    , connectionLimit: 5
});

async function query(sql){
    let conn, rows;
    try{
        conn = await pool.getConnection();        
        rows = await conn.query(sql);
    }catch(err){
        throw err;
    }finally{
        if (conn) conn.end();
        return rows;
    }
}
(async () =>{
    row = await query("INSERT INTO TB_STOCK_M(STOCK_CD, STOCK_NM)VALUES('2', NULL)");
    console.log(row);
})()
module.exports.query = query;
