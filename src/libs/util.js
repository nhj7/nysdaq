// file download test with axios
// http://kind.krx.co.kr/corpgeneral/corpList.do?method=download&searchType=13

const urlDownload = async (url, destFile) => {
    const axios = require('axios');
    const fs = require('fs').promises;
    console.log("start");
    const res = await axios.get(url, {
        //responseType: 'blob'
        responseType: 'arraybuffer'
        , responseEncoding: 'binary'
    })
    console.log(res.data);
    await fs.writeFile(destFile ,res.data);
    console.log("end");
}

const sleep = (ms) => {
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

const getUrlData = async (url) => {
    const axios = require('axios');
    const res = await axios.get(url, {
        
    });
    return res;
}

const commaToNumber = (str) => {
    return str.replace(/,/g, '');
}


(async () =>{
    urlDownload('http://kind.krx.co.kr/corpgeneral/corpList.do?method=download&searchType=13', "kr_stock_list.xls" );
})
//()
module.exports = {
    urlDownload : urlDownload
    , sleep : sleep
    , getUrlData : getUrlData
    , commaToNumber : commaToNumber
}

