const db = require('../../libs/db.js');
const util = require('../../libs/util.js');
const log = require('../../libs/log_pino.js');

const main = async () => {
    log.info("main start");
    try {
    const stockList = await db.pool.query(" select * from TB_STOCK_M");

    log.info(stockList);
    for(let i = 0; i < stockList.length;i++){
        let mergeResult = null;
        let arrParam;
        try {
            //log.info(stockList[i].STOCK_NO, stockList[i].STOCK_NM, stockList[i].STOCK_CD);

            //const res = await util.getUrlData(`https://m.stock.naver.com/api/item/getPriceDayList.nhn?code=${stockList[i].STOCK_CD}&pageSize=40&page=1`);

            const res = await util.getUrlData(`https://m.stock.naver.com/api/stock/${stockList[i].STOCK_CD}/price?pageSize=10&page=1`);
            //log.info('res', res);
            const list = res.data;
            
            const mergeSql = `INSERT INTO nysdaq.TB_STOCK_DAILY_H
            (HIST_DT, STOCK_CD, STOCK_NM, END_PRICE, START_PRICE, CHANGE_PRICE, CHANGE_RATIO, HIGH_PRICE, LOW_PRICE, DAY_VOLUME, DAY_AMOUNT, REG_DTTM, MOD_DTTM)
            VALUES( ? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
                , sysdate(), current_timestamp())        
            ON DUPLICATE KEY UPDATE 
            STOCK_CD = ?, STOCK_NM = ?, END_PRICE = ? , START_PRICE = ? , CHANGE_PRICE = ?
            , CHANGE_RATIO = ?, HIGH_PRICE = ?, LOW_PRICE =?, DAY_VOLUME = ?, DAY_AMOUNT =?, MOD_DTTM = sysdate()  `
            
            arrParam = [];
            for(let li = 0; li < list.length;li++){
                const item = list[li];
                /*
                    {
                            "localTradedAt": "2025-06-27",
                            "closePrice": "60,800",
                            "compareToPreviousClosePrice": "600",
                            "compareToPreviousPrice": {
                                "code": "2",
                                "text": "상승",
                                "name": "RISING"
                            },
                            "fluctuationsRatio": "1.00",
                            "openPrice": "60,100",
                            "highPrice": "61,600",
                            "lowPrice": "60,000",
                            "accumulatedTradingVolume": 17235470
                        },
                */
                
                /*
                arrParam.push(
                    [item.dt, stockList[i].STOCK_CD, stockList[i].STOCK_NM, item.ncv, item.ov, item.cv, item.cr || 0, item.hv, item.lv, item.aq, item.aq
                    , stockList[i].STOCK_CD, stockList[i].STOCK_NM, item.ncv, item.ov, item.cv, item.cr || 0, item.hv, item.lv, item.aq, item.aq // update
                    ]
                )

                */
                arrParam.push(
                    [item.localTradedAt.replace(/-/g, ''), stockList[i].STOCK_CD, stockList[i].STOCK_NM, util.commaToNumber(item.closePrice), util.commaToNumber(item.openPrice), util.commaToNumber(item.compareToPreviousClosePrice), item.fluctuationsRatio, util.commaToNumber(item.highPrice), util.commaToNumber(item.lowPrice), item.accumulatedTradingVolume, item.accumulatedTradingVolume
                    , stockList[i].STOCK_CD, stockList[i].STOCK_NM, util.commaToNumber(item.closePrice), util.commaToNumber(item.openPrice), util.commaToNumber(item.compareToPreviousClosePrice), item.fluctuationsRatio, util.commaToNumber(item.highPrice), util.commaToNumber(item.lowPrice), item.accumulatedTradingVolume, item.accumulatedTradingVolume // update
                    ]
                );
            }   // end for
            log.info(arrParam);
            if(arrParam.length>0){
                mergeResult = await db.pool.batch(mergeSql,arrParam );
            }            
        } catch (error) {
            mergeResult = error;
            log.error(error, arrParam);
        }finally{
            log.info(i, stockList[i].STOCK_NM, stockList[i].STOCK_CD);
        }
        //debugger;
        await util.sleep(500);
    }

    } catch (error) {
        log.info("main error", error);     
    } finally {
        log.info("main end");
        //db.pool.end();
    }
};

//main();

module.exports = main;