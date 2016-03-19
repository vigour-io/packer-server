'use strict'
var bunyan = require('bunyan')
var Config = require('vigour-config')
var config = new Config().logger.plain()

var log = bunyan.createLogger({
  name: config.name,
  level: config.level
  // add streams
})

module.exports = {
  trace: log.trace.bind(log),
  debug: log.debug.bind(log),
  info: log.info.bind(log),
  warn: log.warn.bind(log),
  error: log.error.bind(log),
  fatal: log.fatal.bind(log)
}
