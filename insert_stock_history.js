
const fs = require('fs').promises;
const iconv = require('iconv-lite');
const cheerio = require('cheerio');
const db = require('./module/db.js');

const getItemValue = (node, childIdx) => {
  const rtnVal = node 
  && node.children[childIdx] 
  && node.children[childIdx].children[0]
  && node.children[childIdx].children[0].nodeValue.trim();
  return rtnVal ? rtnVal : "";
}

(async () =>{
  const dirList = await fs.readdir('./', 'utf8');
  console.table((dirList));
  

  console.log("async start");
  const data = await fs.readFile("상장법인목록.xls", "latin1");
  var utfData = iconv.decode(data, "EUC-KR")
  const $ = cheerio.load(utfData);
  const arrItem = $("html>body>table>tbody>tr");


  for (let idx = 0; idx < arrItem.length; idx++) {
    try {
      const el = arrItem[idx];
      const stockNm = getItemValue(el, 1);
      const stockCd = getItemValue(el, 3);
      
      console.log(
        idx
        , stockNm
        , stockCd
        , getItemValue(el, 5)
        , getItemValue(el, 7)
        , getItemValue(el, 9)
        , getItemValue(el, 11)
        , getItemValue(el, 13)
        , getItemValue(el, 15)
        , getItemValue(el, 17)
      );
      insertSql = `insert into TB_STOCK_M(STOCK_CD, STOCK_NM) VALUES('${stockCd}', '${stockNm}' ) ON DUPLICATE KEY UPDATE STOCK_NM = '${stockNm}'  `
      console.log( insertSql );
      const result = await db.query(insertSql);
      console.log("affectedRows : ",result.affectedRows)
    } catch (error) {
      console.error(idx, error);
    }
    
  }
  
  
})();
