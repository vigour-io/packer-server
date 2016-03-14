'use strict'

var log = require('../../logger')

module.exports = exports = function (config) {
  return function (req, res, next) {
    log.info({method: req.method, originalUrl: req.originalUrl, platform: req.platform}, 'loggin request')
    next()
  }
}
