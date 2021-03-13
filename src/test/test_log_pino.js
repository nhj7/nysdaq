const pino = require('pino')

const consoleLogger = pino(
  {
    level: 'debug'
    , prettyPrint: {
      colorize: true
      , translateTime: 'yyyy-mm-dd HH:MM:ss'
      , ignore: 'pid,hostname'
    }
    , prettifier: require('pino-pretty')
    , sync: false
  }
  , pino.destination({ sync: false })
)
const fileLogger = pino(
  {
    level: 'debug'
    , prettyPrint: {
      translateTime: 'yyyy-mm-dd HH:MM:ss'
      , ignore: 'pid,hostname'
    }
    //, prettifier : require('pino-pretty')
    , sync: false
  }
  , pino.destination({ dest: '/log/nysdaq/pino_debug.log', sync: false })
)

const logger = {
  debug: (...args) => {
    //console.log('debug',args);
    consoleLogger.debug(args.length == 1 ? args[0] : args);
    fileLogger.debug(args.length == 1 ? args[0] : args);
  }, flush: () => {
    consoleLogger.flush();
    fileLogger.flush();
  }, info: (...args) => {
    //console.log('info',args);
    consoleLogger.info(args.length == 1 ? args[0] : args);
    fileLogger.info(args.length == 1 ? args[0] : args);
  }, error: (...args) => {
    //console.log('erorr',args);
    consoleLogger.error(args.length == 1 ? args[0] : args);
    fileLogger.error(args.length == 1 ? args[0] : args);
  }
}

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


['debug', 'info', 'error'].forEach((methodName) => {
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


//console.log("pino console");
logger.debug(`pino debug`)
logger.info('pino info')
logger.error(`pino error`)

//logger.flush();
//logger2.flush();

//console.log("123123");

//debugger;