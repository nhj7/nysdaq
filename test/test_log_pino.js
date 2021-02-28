const pino = require('pino')

const logger = pino(
    { 
        level : 'debug'
        , prettyPrint : { } 
        //, prettifier : require('pino-pretty')
        , sync: false 
    }
    , pino.destination({ dest : '/log/nysdaq/pino_debug.log', sync: false} )
)
const finalLog = pino(
    pino.destination({ dest : '/log/nysdaq/pino_final.log', sync: false} )
)

/*
const pinoDebug = require('pino-debug')
pinoDebug(logger, {
    auto: true, // default
    map: {
      'example:server': 'info',
      'express:router': 'debug',
      '*': 'trace' // everything else - trace
    }
  })
*/
// asynchronously flush every 10 seconds to keep the buffer empty
// in periods of low activity
setInterval(function () {
  logger.flush()
}, 10000).unref()


// use pino.final to create a special logger that
// guarantees final tick writes
const handler = pino.final(finalLog, (err, finalLogger, evt) => {
    console.log(`console ${evt} caught`);
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

logger.debug(`debug`)
logger.info(`info`)
logger.error(`error`)

//logger.flush();
//logger2.flush();

console.log("123123");

debugger;