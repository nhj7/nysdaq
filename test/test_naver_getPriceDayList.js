

(async () => {
    console.log("async func.");

    const util = require("../module/util.js");

    const res = await util.getUrlData(`https://m.stock.naver.com/api/item/getPriceDayList.nhn?code=241510&pageSize=30&page=1`);
    const item = res.data.result.list[0];
    console.log(
        item.dt         // 일자
        , item.ncv      // 종가
        , item.cv       // 전일대비
        , item.cr       // 등락율
        , item.aq       // 거래량(?)
        , item.hv       // 일 고가
        , item.lv       // 일 저가
        , item.ov       // 일 시초가
        , item.rf       // 변경 코드. 
        , item
    );

    debugger;


})();