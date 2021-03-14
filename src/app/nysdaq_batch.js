const batch = require("./batch")
const log = require("../libs/log_pino")
const db = require("../libs/db")

log.debug("batch start");

const main = async () => {
    const workHistQry = `INSERT INTO nysdaq.TB_WORK_H ( WORK_TITLE, WORK_STATUS, WORK_CONTENT )
    VALUES ( 'DAILY_BATCH', '0', '')`
    await db.pool.query(workHistQry);
    await batch.insertStockItem();
    await batch.insertStockDayPrice();
}

const cron = require('node-cron');
cron.schedule('0 31 */1 * * *', async () => {
//cron.schedule('0 */1 * * * *', async () => {    
    log.debug('running a task every day 1 16 hour ');
    await main();
    log.debug('end.');}
    , { timezone: "Asia/Seoul" }
);
