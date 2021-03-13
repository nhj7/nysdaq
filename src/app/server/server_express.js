
const diff_sql =
    `
select 
STOCK_CD 
, STOCK_NM 
, ROUND( (recent_price / avg_price - 1) * 100, 2) as DIFF_RATE
, max_dt_seq
, floor(avg_price) as avg_price
, recent_price
from (
select
    tsdh .STOCK_CD
    , max(tsdh .STOCK_NM ) as stock_nm
    , sum(tsdh.END_PRICE ) / count(*) as avg_price
    , max( dt_seq ) as max_dt_seq
    , SUBSTRING_INDEX(GROUP_CONCAT(tsdh.END_PRICE ORDER BY dt_seq asc), ',', 1) recent_price 
from (
    select
        (select count(*) + 1 from TB_STOCK_DAILY_H where STOCK_CD = tmp.STOCK_CD and HIST_DT > tmp.HIST_DT ) as dt_seq
        , tmp.*  
    from TB_STOCK_DAILY_H tmp
    where (select count(*) + 1 from TB_STOCK_DAILY_H where STOCK_CD = tmp.STOCK_CD and HIST_DT > tmp.HIST_DT ) <= 25
) tsdh 
where 1=1
-- and tsdh.STOCK_CD in ( '005930'  , '035420' , '033540')
group by tsdh.stock_cd
order by tsdh.stock_cd
) diff_t
order by ROUND( (recent_price / avg_price - 1) * 100, 2) asc 
`

console.log(diff_sql);

const db = require("../../libs/db");
const log = require("../../libs/log_winston.js");

let diffList = [];
let diffListHtml = '';
const selectDiffList = async () => {
    diffList = await db.pool.query(diff_sql);
    diffListHtml = tableGenerator(diffList);
}

function tableGenerator(data) { // data is an array
    let html = `<meta name="viewport" content="width=device-width, initial-scale=1"><table border='1'>`;
    var keys = Object.keys(Object.assign({}, ...data));// Get the keys to make the header
    // Add header
    var head = '<thead><tr>';
    keys.forEach(function (key) {
        head += '<th>' + key + '</th>';
    });
    html = html.concat(head + '</tr></thead>');
    // Add body
    var body = '<tbody>';
    data.forEach(function (obj) { // For each row
        var row = '<tr>';
        keys.forEach(function (key) { // For each column
            row += '<td>';
            if (obj.hasOwnProperty(key)) { // If the obj doesnt has a certain key, add a blank space.
                row += obj[key];
            }
            row += '</td>';
        });
        body += row + '</tr>';
    })
    html = html.concat(body + '</tbody></table>');
    return html;
}

const main = async () => {
    log.info("start app.js");
    await selectDiffList();
    log.info("select selectDiffList end");
    
    const fastify = require('fastify')({
        //logger 
        logger: true
    })

    fastify.get('/', async (request, reply) => {
        reply.type('text/html;charset=utf-8').code(200)
        return diffListHtml;
    })
    fastify.listen(7000, "0.0.0.0", (err, address) => {
        if (err) throw err
        fastify.log.info(`server listening on ${address}`)
    })
}

main();
