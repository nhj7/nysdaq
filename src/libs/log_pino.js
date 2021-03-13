const pino = require('pino')


const logPath1 = `/log/`;
const logPath2 = `/log/nysdaq`;

const logPath = `${logPath2}`;

const fs = require("fs");
!fs.existsSync(logPath1) && fs.mkdirSync(logPath1);
!fs.existsSync(logPath2) && fs.mkdirSync(logPath2);

const translateTime = 'SYS:yyyy-mm-dd HH:MM:ss'

const consoleLogger = pino(
  {
    level: 'debug'
    , disableRequestLogging : false
    , prettyPrint: {
      colorize: true
      , translateTime: translateTime
      , ignore: 'pid,hostname'
    }
    , prettifier: require('pino-pretty')
    , sync: false
    , serializers: {
        res (reply) {
            // The default
            return {
              statusCode: reply.statusCode
            }
          },
        req (request) {
          return {
            method: request.method,
            url: request.url,
            headers: request.headers,
            hostname: request.hostname,
            remoteAddress: request.ip,
            remotePort: request.socket.remotePort
          }
        }
      }
  }
  , pino.destination({ sync: false })
)
const fileDebugLogger = pino(
  {
    level: 'debug'
    , disableRequestLogging : true
    , prettyPrint: {
      translateTime: translateTime
      , ignore: 'pid,hostname'
    }
    //, prettifier : require('pino-pretty')
    , sync: false
  }
  , pino.destination({ dest: `${logPath}/log_nysdaq.log`, sync: false })
)

const fileErrorLogger = pino(
    {
      level: 'error'
      , disableRequestLogging : true
      , prettyPrint: {
        translateTime: translateTime
        , ignore: 'pid,hostname'
      }
      //, prettifier : require('pino-pretty')
      , sync: false
    }
    , pino.destination({ dest:  `${logPath}/error_nysdaq.log`, sync: false })
  )

// info, error, debug, fatal, warn, trace, ch

const getPinoLogger = ( arrLogs) => { 
    const logger = {
    debug: (...args) => {
        arrLogs.forEach((logger)=>{logger.debug(args.length == 1 ? args[0] : args);});
    }, flush: () => {
        arrLogs.forEach((logger)=>{logger.flush()});
    }, info: (...args) => {
        arrLogs.forEach((logger)=>{logger.info(args.length == 1 ? args[0] : args);});
    }, error: (...args) => {
        arrLogs.forEach((logger)=>{logger.error(args.length == 1 ? args[0] : args);});
    }, fatal : (...args) => {
        arrLogs.forEach((logger)=>{logger.fatal(args.length == 1 ? args[0] : args);});
    }, warn : (...args) => {
        arrLogs.forEach((logger)=>{logger.warn(args.length == 1 ? args[0] : args);});
    }, trace : (...args) => {
        arrLogs.forEach((logger)=>{logger.trace(args.length == 1 ? args[0] : args);});
    }, child : (opt) => {
        
        const arrChildLogs = arrLogs.map( logger => { return logger.child(opt) } );

        //console.log("child....", arrChildLogs);
        return getPinoLogger(arrChildLogs);
    }
    } // end logger
    
    {
        ['debug', 'info', 'error', 'trace', 'fatal', 'warn'].forEach((methodName) => {
            const originalMethod = logger[methodName];
            logger[methodName] = (...args) => {
              let initiator = 'unknown place';
              try {
                throw new Error();
              } catch (e) {
                if (typeof e.stack === 'string') {
                  let isFirst = true;
                  for (const line of e.stack.split('\n')) {
                    const matches = line.match(/^\s+at\s+(.*)/);
                    if (matches) {
                      if (!isFirst) { // first line - current function
                        // second line - caller (what we are looking for)
                        initiator = matches[1];
          
                        try {
                          initiator = e
                            .stack // Grabs the stack trace
                            .split('\n')[2] // Grabs third line
                            .trim() // Removes spaces
                            .substring(3) // Removes three first characters ("at ")
                          //.replace(__dirname, '') // Removes script folder path
                          //.replace(/\s\(./, ' at ') // Removes first parentheses and replaces it with " at "
                          //.replace(/\)/, '') // Removes last parentheses
                        } catch (ee) {
                          console.error(ee);
                        }
                        break;
                      }
                      isFirst = false;
                    }
                  }
                }
              }
              initiator = ' [' + initiator + ']'
              if (args.length == 1 && typeof args[0] == 'string') {
                args[0] = args[0] + ' ' + initiator;
                originalMethod.apply(logger, [...args]);
              } else {
                originalMethod.apply(logger, [...args, initiator]);
              }
            };
          });

    }

    return logger;
}

const logger = getPinoLogger( [consoleLogger, fileDebugLogger, fileErrorLogger] );

const finalLog = pino(
  pino.destination({ dest: '/log/nysdaq/pino_final.log', sync: true })
)

// asynchronously flush every 10 seconds to keep the buffer empty
// in periods of low activity
setInterval(function () {
  logger.flush()
}, 10000).unref()


// use pino.final to create a special logger that
// guarantees final tick writes
const handler = pino.final(finalLog, (err, finalLogger, evt) => {
  //console.log(`console ${evt} caught`);
  logger.flush()
  finalLogger.info(`finalLogger. ${evt} caught`)
  if (err) finalLogger.error(err, 'error caused exit')
  process.exit(err ? 1 : 0)
})

// catch all the ways node might exit
process.on('beforeExit', () => handler(null, 'beforeExit'))
process.on('exit', () => handler(null, 'exit'))
process.on('uncaughtException', (err) => handler(err, 'uncaughtException'))
process.on('SIGINT', () => handler(null, 'SIGINT'))
process.on('SIGQUIT', () => handler(null, 'SIGQUIT'))
process.on('SIGTERM', () => handler(null, 'SIGTERM'))


//console.log("1");
// console log add file and line number.
try {
  ['log', 'warn', 'error'].forEach((methodName) => {
    const originalMethod = console[methodName];
    console[methodName] = (...args) => {
      let initiator = 'unknown place';
      try {
        throw new Error();
      } catch (e) {
        if (typeof e.stack === 'string') {
          let isFirst = true;
          for (const line of e.stack.split('\n')) {
            const matches = line.match(/^\s+at\s+(.*)/);
            if (matches) {
              if (!isFirst) { // first line - current function
                // second line - caller (what we are looking for)
                initiator = matches[1];
                break;
              }
              isFirst = false;
            }
          }
        }
      }
      originalMethod.apply(console, [...args, `  at ${initiator}`]);
    };
  });
} catch (e) {
  console.error(e);
}
try {
  logger.debug(`pino debug 1`)
  logger.debug(`pino debug 2`)
  logger.info('pino info')
  logger.error(`pino error`)
} catch (error) {
  console.error("error.", error);
}


module.exports = logger;