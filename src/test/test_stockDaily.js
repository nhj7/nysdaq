
// http://asp1.krx.co.kr/servlet/krx.asp.XMLSise?code=035420

const main = async(stockCd)=>{
    const db = require('../module/db.js');
    const util = require('../module/util.js');
    const axios = require('axios');

    const stockList = await db.pool.query(`select * from TB_STOCK_M`);

    for(let i = 0 ; i < stockList.length;i++){
        //console.log("", stockList[i].STOCK_CD);

        const url = `http://asp1.krx.co.kr/servlet/krx.asp.XMLSise?code=${stockList[i].STOCK_CD}`;
        //const url = `http://asp1.krx.co.kr/servlet/krx.asp.XMLSise?code=005930`;
        const res = await axios.get(url, {
            
        })
        //console.log(res.data);

        const jsdom = require('jsdom');
        const { JSDOM } = jsdom;
        const dom = new JSDOM(res.data);

        const document = dom.window.document;

        const dailystock = document.getElementsByTagName("dailystock");
        
        //console.log(document.body.innerHTML)
        if(dailystock.length > 0 ){
            console.log(stockList[i].STOCK_NM , stockList[i].STOCK_CD, dailystock[0].attributes["day_date"].value);
        }else{
            console.log(stockList[i].STOCK_NM , stockList[i].STOCK_CD, "Not Value.");
        }
        
        util.sleep(500);
    }

    db.pool.end();
};
//035420
main("035420");