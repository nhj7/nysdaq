'use strict';

try {
    module.exports.insertStockItem = require("./insert_stock_item");    
} catch (error) {
    console.error("insertStockItem error", error);
}

try {
    module.exports.insertStockDayPrice = require("./insert_stock_day_price");    
} catch (error) {
    console.error("insertStockDayPrice error", error);
}