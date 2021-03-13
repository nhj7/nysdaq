const db = require('mariadb');
require('dotenv').config();

// 설정된 환경으로 config 적용.
const pool = db.createPool({
    host: process.env.DB_HOST || 'localhost'
    , port:process.env.DB_PORT || 3306
    , user: process.env.DB_ID || 'nysdaq'
    , password: process.env.DB_PASSWORD || 'nysdaq'
    , database: "nysdaq"
    , connectionLimit: 5
});

async function query(sql){
    let conn, rows;
    try{
        conn = await pool.getConnection();
        console.log(pool, conn);
        rows = await conn.query(sql);
    }catch(err){
        rows = err;
        throw err;
    }finally{
        if (conn) conn.release();
        return rows;
    }
}

async function query2(sql){
    const result = await pool.query(sql);
    return result;
}
(async () =>{
    try{
        //console.log("start");
        row = await query2("INSERT INTO TB_STOCK_M(STOCK_CD, STOCK_NM)VALUES('2', NULL)");
        //console.log(row);
    }catch(err){
        console.error("err", err);
    }finally{
        const endResult = await pool.end();
        console.log("endResult : ", endResult);
    }
    
})
//()
module.exports.query = query;
module.exports.pool = pool;
