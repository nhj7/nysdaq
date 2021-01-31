const db = require('mariadb');
require('dotenv').config();

// 설정된 환경으로 config 적용.
const pool = db.createPool({
    host: process.env.DB_HOST
    , port:process.env.DB_PORT
    , user: process.env.DB_ID
    , password: process.env.DB_PASSWORD
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
})();
 
module.exports = {
    test: test
}