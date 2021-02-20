
(async () => {   
  const krx = require('krx-stock-api');
  //list = krx.default.;
  //console.log(krx, list);

  const stock = await krx.default.getStock('035420');
  console.log(`${stock.name} : ${stock.price}?`); 
} )();