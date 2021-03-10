
const fs = require('fs').promises;
const iconv = require('iconv-lite');
const cheerio = require('cheerio');
const db = require('../module/db.js');
const util = require('../module/util.js');
const log = require('../module/log_pino.js');

const getItemValue = (node, childIdx) => {
  const rtnVal = node 
  && node.children[childIdx] 
  && node.children[childIdx].children[0]
  && node.children[childIdx].children[0].nodeValue.trim();
  return rtnVal ? rtnVal : "";
}

const main = async () =>{
  try {
    
  log.debug("1");  
  console.log("12");
  const dirList = await fs.readdir('./', 'utf8');
  console.table((dirList));
  
  log.debug("2");

  const url = 'http://kind.krx.co.kr/corpgeneral/corpList.do?method=download&searchType=13';
  
  log.info(`start url download ${url}` );
  const destFile = `./asset/data/kr_stock_list.xls`;
  await util.urlDownload(url,destFile);
  
  log.info(`end url download` );

  log.info("async start");
  const data = await fs.readFile(destFile, "latin1");
  var utfData = iconv.decode(data, "EUC-KR")
  const $ = cheerio.load(utfData);
  const arrItem = $("html>body>table>tbody>tr");

  const batchParam = [];
  for (let idx = 0; idx < arrItem.length; idx++) {
    try {
      const el = arrItem[idx];
      const stockNm = getItemValue(el, 1);
      const stockCd = getItemValue(el, 3);
      if(stockCd=="종목코드"){
        continue;
      }
      // log.info(
      //   idx
      //   , stockNm
      //   , stockCd
      //   , getItemValue(el, 5)
      //   , getItemValue(el, 7)
      //   , getItemValue(el, 9)
      //   , getItemValue(el, 11)
      //   , getItemValue(el, 13)
      //   , getItemValue(el, 15)
      //   , getItemValue(el, 17)
      // );
      batchParam.push([stockCd, stockNm, stockNm]);
      // insertSql = `insert into TB_STOCK_M(STOCK_CD, STOCK_NM) VALUES('${stockCd}', '${stockNm}' ) ON DUPLICATE KEY UPDATE STOCK_NM = '${stockNm}'  `
      // log.info( insertSql );
      // const result = await db.query(insertSql);
      // log.info("result : ",result)
    } catch (error) {
      console.error(idx, error);
    }
  } // end for
  log.info("batchQuery Start ");
  const batchResult = await db.pool.batch(`insert into TB_STOCK_M(STOCK_CD, STOCK_NM) VALUES(?, ? ) ON DUPLICATE KEY UPDATE STOCK_NM = ?`, batchParam);
  
  log.info("batchResult : ",batchResult);



  await db.pool.end();
  
  } catch (error) {
    log.error("error : ",error);
  }
};

main();

module.exports = main;
