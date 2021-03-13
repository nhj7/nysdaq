
const winston = require('winston');
require('winston-daily-rotate-file');
const util = require('util');
const moment = require('moment');
const tsFormat = () => moment().format('YYYY-MM-DD hh:mm:ss').trim();

const createLogger = (logPath) => {
  logPath =  logPath || '/log/nysdaq/';
  const logger =  winston.createLogger({
    transports: [
      new (winston.transports.Console)({ 
         level : 'debug'
          , timestamp: tsFormat 
          , format : winston.format.combine(
             winston.format.simple()
             , winston.format.colorize({ all : true })
             //, winston.format.align()
             ,  winston.format.printf((info) => {
                 let {
                   timestamp, level, message, ...args
                 } = info;
                 //console.log('args', args, winston.format.colorize("123"));
                 //return `${tsFormat()} ${level}: ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`;
                 return `${tsFormat()} ${level} : ${message}`;
             })
             
           ) // format
         }),
      new (winston.transports.DailyRotateFile)({
           // filename property 지정
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

module.exports.logger = logger;
//logger.log('debug', 'START ');
logger.info('START WINSTON LOG');
//logger.error('error logs'); 
}

createLogger();