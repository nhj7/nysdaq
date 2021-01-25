
var fs = require('fs');
fs.readdir('./', 'utf8', function(err, dirList){
    console.table((dirList));
});

const iconv = require('iconv-lite');
const cheerio = require('cheerio');

const getItemValue = (node, childIdx) => {

  const rtnVal = node 
  && node.children[childIdx] 
  && node.children[childIdx].children[0]
  && node.children[childIdx].children[0].nodeValue.trim();
  return rtnVal ? rtnVal : "";
}

(async () =>{
  console.log("async start");

  fs.readFile("상장법인목록.xls", "latin1", (err, data) => {
    var utfData = iconv.decode(data, "EUC-KR")
    //console.log(utfData);

    const $ = cheerio.load(utfData);
    const arrItem = $("html>body>table>tbody>tr");
    //debugger;
    arrItem.each((idx, el) => {
      try {
        console.log(
          idx
          , getItemValue(el, 1)
          , getItemValue(el, 3)
          , getItemValue(el, 5)
          , getItemValue(el, 7)
          , getItemValue(el, 9)
          , getItemValue(el, 11)
          , getItemValue(el, 13)
          , getItemValue(el, 15)
          , getItemValue(el, 17)
        );
      } catch (error) {
        console.error(idx, error);
      }
      
    });
    
    debugger;
  })

})();
