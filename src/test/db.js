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

async function test(){
    let conn, rows;
    try{
        conn = await pool.getConnection();        
        rows = await conn.query('SELECT 1 as NUM');
    }catch(err){
        throw err;
    }finally{
        if (conn) conn.end();
        return rows;
    }
}

(async () =>{
    row = await test();
    console.log(row);

    pool.end();
})();
 
module.exports = {
    test: test
}
