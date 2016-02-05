'use strict'

var log = require('npmlog')

module.exports = function (cfg) {
  return function (req, res, next) {
    log.info('user-agent', req.headers['user-agent'])
    next()
  }
}
