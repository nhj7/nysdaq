

var fs = require('fs')
var pinoms = require('pino-multi-stream')
var streams = [
  {stream: fs.createWriteStream('/tmp/info.stream.out')},
  {stream: process.stdout},
  {level: 'fatal', stream: fs.createWriteStream('/tmp/fatal.stream.out')}
]
var log = pinoms({streams: streams})

log.info('this will be written to /tmp/info.stream.out')
log.fatal('this will be written to /tmp/fatal.stream.out')
