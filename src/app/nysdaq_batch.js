console.log("batch start");

const batch = require("./batch")

console.log("batch start 22");

const main = async () => {
    await batch.insertStockItem();
    await batch.insertStockDayPrice();
}

const cron = require('node-cron');

cron.schedule('0 31 15 * * *', async () => {
//cron.schedule('0 */1 * * * *', async () => {    
    console.log('running a task every day 1 16 hour ');
    await main();
    console.log('end.');
}
    , { timezone: "Asia/Seoul" }
);
