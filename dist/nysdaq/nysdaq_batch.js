const batch = require("./batch")

const main = async () => {
    await batch.insertStockItem();
    await batch.insertStockDayPrice();
}

const cron = require('node-cron');

cron.schedule('0 34 9 * * *', async () => {
    console.log('running a task every day 1 16 hour ');
    await main();

    console.log('end.');
}
, {timezone : "Asia/Seoul"}
);
