
const diff_sql =
    `
select 
	STOCK_CD
	, STOCK_NM 
	, ROUND( (recent_price / avg_price - 1) * 100, 2) as DIFF_RATE
	, HIST_CNT
	, floor(avg_price) as AVG_PRICE
    , RECENT_PRICE
    /*, recent_dt */
    , RECENT_DTTM
from (
	select
		tsdh .STOCK_CD
		, max(tsdh.STOCK_NM ) as stock_nm
		, sum(tsdh.END_PRICE ) / count(*) as avg_price
		, max( dt_seq ) as hist_cnt
        , SUBSTRING_INDEX(GROUP_CONCAT(tsdh.END_PRICE ORDER BY dt_seq asc), ',', 1) recent_price 
        , SUBSTRING_INDEX(GROUP_CONCAT(tsdh.HIST_DT ORDER BY dt_seq asc), ',', 1) recent_dt 
        , DATE_FORMAT(max(tsdh.MOD_DTTM), '%Y-%m-%d %H:%m:%s') as recent_dttm
	from (
		SELECT 
            *
        FROM (	
        SELECT 
            RANK() OVER( PARTITION BY STOCK_CD ORDER BY HIST_DT DESC)  AS dt_seq
            , TSDH.*
        FROM TB_STOCK_DAILY_H TSDH
        ) TSDH WHERE dt_seq <= 25
	) tsdh 
	where 1=1
	-- and tsdh.STOCK_CD in ( '005930'  , '035420' , '033540')
	group by tsdh.stock_cd
	order by tsdh.stock_cd
) diff_t
where RECENT_DTTM > DATE_ADD(CURRENT_TIMESTAMP(), INTERVAL -14 DAY )
and ROUND( (recent_price / avg_price - 1) * 100, 2) <= -10
order by ROUND( (recent_price / avg_price - 1) * 100, 2) asc 
`



const db = require('../../libs/db');
const log = require("../../libs/log_pino");
const log_winston = require('../../libs/log_winston');

let diffList = [];
let diffListHtml = '';
const selectDiffList = async () => {
    log.debug(diff_sql);
    diffList = await db.pool.query(diff_sql);
    diffListHtml = tableGenerator(diffList);
}

function tableGenerator(data) { // data is an array
    let html = 
`
<!doctype html>
<html lang='ko'>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<!-- CSS only -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">

<style>
table td{
    border : solid 1px;
}
</style>
</head>
<body style='padding:3em;'>
`;
    var keys = Object.keys(Object.assign({}, ...data));// Get the keys to make the header
    // Add header
    let table = `<table border='1' ><thead><tr>`;
    keys.forEach(function (key) {
        table += '<th scope="col">' + key + '</th>';
    });
    table = table + '</tr></thead>';
    // Add body
    var body = '<tbody>';
    data.forEach(function (obj) { // For each row
        var row = '<tr scope="row">';
        keys.forEach(function (key) { // For each column
            row += '<td>';
            if (obj.hasOwnProperty(key)) { // If the obj doesnt has a certain key, add a blank space.
                row += obj[key];
            }
            row += '</td>';
        });
        body += row + '</tr>';
    })
    html = html.concat( table + body + 
        `</tbody></table>
        <!-- JavaScript Bundle with Popper -->
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>        
        </body></html>`
        );
    return html;
}

const main = async () => {
    log.info("start app.js");
    await selectDiffList();

    //log.info("html", diffListHtml);

    const cron = require('node-cron');

    cron.schedule('0 40 */1 * * *', async () => {
        log.debug('running a task every hour ');
        await selectDiffList();
        log.debug('end.');
    }
        , { timezone: "Asia/Seoul" }
    );

    log.info("select selectDiffList end");

    const fastify = require('fastify')({
        logger: log
        , 'disableRequestLogging': true        
    })

    fastify.get('/', async (request, reply) => {
        reply.type('text/html;charset=utf-8').code(200)

        log.info(`server accept ${request.ip}`)

        return diffListHtml;
    })
    fastify.listen(7000, "0.0.0.0", (err, address) => {
        if (err) {
            log.error("server listen error", err);
            throw err
        }
        log.info(`server listening on ${address}`)
    })
}

//main();

module.exports = main;