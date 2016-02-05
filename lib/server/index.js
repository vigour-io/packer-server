'use strict'

var express = require('express')
var compress = require('compression')
var logUA = require('./middleware/logua')
var ua = require('./middleware/ua')
var status = require('./middleware/status')
var headers = require('./middleware/headers')
var robots = require('./middleware/robots')
var staticFiles = require('./middleware/static')
var config

var Server = module.exports = {
  port: undefined,
  app: undefined,
  start: function (cfg) {
    config = cfg
    var port = this.port = config.port
    return new Promise((resolve, reject) => {
      var app = Server.app = express()
      app.use(compress())
      if (config.verbose) {
        app.use(logUA(config))
      }
      app.use(ua(config))
      app.use('/status', status(config))
      app.use(headers(config))
      if (config.robots) {
        app.get('/robots.txt', robots(config))
      }
      app.use(staticFiles(config))
      app.listen(port, resolve)
    })
  }
}
