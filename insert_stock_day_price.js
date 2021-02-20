const db = require('./module/db.js');
const util = require('./module/util.js');

const main = async () => {
    console.log("main start");

    try {
        
    

    const stockList = await db.pool.query(" select * from TB_STOCK_M ");

    console.log(stockList);
    for(let i = 0; i < stockList.length;i++){
        let mergeResult;
        try {
            console.log(stockList[i].STOCK_NO, stockList[i].STOCK_NM, stockList[i].STOCK_CD);

            const res = await util.getUrlData(`https://m.stock.naver.com/api/item/getPriceDayList.nhn?code=${stockList[i].STOCK_CD}&pageSize=40&page=1`);

            const list = res.data.result.list;

            const mergeSql = `INSERT INTO nysdaq.TB_STOCK_DAILY_H
            (HIST_DT, STOCK_NO, STOCK_CD, STOCK_NM, END_PRICE, START_PRICE, CHANGE_PRICE, CHANGE_RATIO, HIGH_PRICE, LOW_PRICE, DAY_VOLUME, DAY_AMOUNT, REG_DTTM, MOD_DTTM)
            VALUES( ? , ? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
                , current_timestamp(), current_timestamp())        
            ON DUPLICATE KEY UPDATE 
            STOCK_CD = ?, STOCK_NM = ?, END_PRICE = ? , START_PRICE = ? , CHANGE_PRICE = ?
            , CHANGE_RATIO = ?, HIGH_PRICE = ?, LOW_PRICE =?, DAY_VOLUME = ?, DAY_AMOUNT =? `
            
            const arrParam = [];
            for(let li = 0; li < list.length;li++){
                const item = list[li];
                console.log(
                    /*
                    item.dt         // 일자
                    , item.ncv      // 종가
                    , item.cv       // 전일대비
                    , item.cr       // 등락율
                    , item.aq       // 거래량(?)
                    , item.hv       // 일 고가
                    , item.lv       // 일 저가
                    , item.ov       // 일 시초가
                    , item.rf       // 변경 코드. 
                    
                    , */ item
                );
                
                arrParam.push(
                    [item.dt, stockList[i].STOCK_NO, stockList[i].STOCK_CD, stockList[i].STOCK_NM, item.ncv, item.ov, item.cv, item.cr, item.hv, item.lv, item.aq, item.aq
                    , stockList[i].STOCK_CD, stockList[i].STOCK_NM, item.ncv, item.ov, item.cv, item.cr, item.hv, item.lv, item.aq, item.aq // update
                    ]
                )
                
            }
            mergeResult = await db.pool.batch(mergeSql,arrParam );
        } catch (error) {
            mergeResult = error;
        }finally{
            console.log(stockList[i].STOCK_NM, stockList[i].STOCK_CD ,mergeResult);
        }
        //debugger;
        await util.sleep(200);
    }

    } catch (error) {
        console.log("main error", error);     
    } finally {
        console.log("main end");
        db.pool.end();
    }
};

main();