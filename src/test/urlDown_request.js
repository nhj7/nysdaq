// file download test with request-promise
// http://kind.krx.co.kr/corpgeneral/corpList.do?method=download&searchType=13





(async () =>{

let options = {
    method: 'GET',
    uri: 'http://kind.krx.co.kr/corpgeneral/corpList.do?method=download&searchType=13',
    qs: undefined,
    body: undefined,
    rejectUnauthorized: false,
    json: false
};
const rp = require('request-promise');
const fs = require('fs');
const fw = fs.createWriteStream('kr_stock_list.xls');

console.log("start");

await rp(options).pipe(fw).on('error', err => {
    console.error('==pipe err', err);
    reject(err);
});

console.log("end");

})();
