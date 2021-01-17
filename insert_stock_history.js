
var fs = require('fs');
fs.readdir('./', 'utf8', function(err, dirList){
    console.table((dirList));
});

var iconv = require('iconv-lite');



(async () =>{
  console.log("async start");

  fs.readFile("상장법인목록.xls", "latin1", (err, data) => {
    var utfData = iconv.decode(data, "EUC-KR")
    console.log(utfData);
  })

})();
