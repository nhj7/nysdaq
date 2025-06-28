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

    log.debug('end main manual');

}

if (process.argv[2] == "run") {
    log.debug('start main manual');
    main();
    return;
}

if (process.argv[2] != "run") {
    const cron = require('node-cron');

    // every day am 8 3: 0
    cron.schedule('0 30 8 */1 * *', async () => {
        //cron.schedule('0 */1 * * * *', async () => {    
        log.debug('insertStockItem start');

        const workHistQry = `INSERT INTO nysdaq.TB_WORK_H ( WORK_TITLE, WORK_STATUS, WORK_CONTENT )
        VALUES ( 'BATCH', '0', 'insertStockItem')`
        await db.pool.query(workHistQry);

        await batch.insertStockItem();
        log.debug('end.');
    }
        , { timezone: "Asia/Seoul" }
    );

    cron.schedule('0 0 17 * * *', async () => {
        //cron.schedule('0 */1 * * * *', async () => {
        const workHistQry = `INSERT INTO nysdaq.TB_WORK_H ( WORK_TITLE, WORK_STATUS, WORK_CONTENT )
            VALUES ( 'BATCH', '0', 'insertStockDayPrice')`
        await db.pool.query(workHistQry);
        log.debug('insertStockDayPrice start ');
        await batch.insertStockDayPrice();
        log.debug('end.');
    }

        , { timezone: "Asia/Seoul" }
    );
}