'use strict'

var log = require('npmlog')

module.exports = exports = function (config) {
  return function (req, res, next) {
    log.info(req.method, req.originalUrl, req.platform)
    next()
  }
}
