
const log = (logPath) => { 
    const winston = require('winston')
    const winston_daily = require('winston-daily-rotate-file')
    const util = require('util')
    const moment = require('moment')
    const tsFormat = () => moment().format('YYYY-MM-DD hh:mm:ss').trim()
    logPath =  logPath || '/log/nysdaq/';
    const logger =  winston.createLogger({
          transports: [
            new (winston.transports.Console)({ 
               level : 'debug'
                , timestamp: tsFormat 
                , format : winston.format.combine(
                   winston.format.simple()
                   //, winston.format.splat()
                   , winston.format.colorize({ all : true })
                   //, winston.format.align()
                   ,  winston.format.printf((info) => {
                       let {
                         timestamp, level, message, ...args
                       } = info;
                       //console.log('args', args, winston.format.colorize("123"));
                       return `${tsFormat()} ${level}: ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`;
                       //sreturn `${tsFormat()} ${level} : ${message} ${args} `;
                   })
                   
                 ) // format
               }),
            new (winston.transports.DailyRotateFile)({
                 // filename property ì§€ì •
                 name : 'log'
                 , level: 'info'
                 , filename: logPath + 'console.log'
                 , datePattern: 'YYYY.MM.DD'
                 , prepend: false
                 , maxDays: 10
                 , maxFiles: '14d'
                 , format : winston.format.combine(
                   winston.format.simple()
                   ,  winston.format.printf((info) => {
                       let {
                         timestamp, level, message, ...args
                       } = info;
                       return `${tsFormat()} ${level} : ${message}`;
                   })
                 ) // format
       
             }),
            new (winston.transports.DailyRotateFile)({
                name : 'error_log'
                , filename: logPath + 'error.log'
                , datePattern: 'YYYY.MM.DD'
                , prepend: false
                , level : 'error'
                , maxDays: 10
                , maxFiles: '14d'
                , format : winston.format.combine(
                 winston.format.simple()
                 ,  winston.format.printf((info) => {
                     let {
                       timestamp, level, message, ...args
                     } = info;
                     return `${tsFormat()} ${level} : ${message}`;
                 })
               ) // format
            })
          ]
       });

    //logger.info("START WINSTON LOG");
    return {
        info : (...args) =>{
            logger.info(args);
        }, error : (...args) => {
            logger.error(args);
        }, debug : (...args) => {
            logger.log('debug',args);
        }, logger : logger
    }

}

//log();

module.exports = log();
/*

module.exports = {
    info : (...args) =>{
        log.logger.info(args);
    }, error : (...args) => {
        log.logger.error(args);
    }, debug : (...args) => {
        log.logger.log('debug',args);
    }
}
module.exports.debug('START WINSTON LOG', {"aa":"11"}, {"bb":"222"}, 111);
module.exports.info('START WINSTON LOG', {"aa":"11"}, {"bb":"222"}, 111);
module.exports.error('START WINSTON LOG ERROR');
module.exports.createLogger = createLogger;

*/