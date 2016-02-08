'use strict'

var express = require('express')
var compress = require('compression')
var ua = require('./middleware/ua')
var status = require('./middleware/status')
var headers = require('./middleware/headers')
var robots = require('./middleware/robots')
var staticFiles = require('./middleware/static')
var fallback = require('./middleware/fallback')
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
      app_get(app, ua(config))
      app.get('/status', status(config))
      app_get(app, headers(config))
      if (config.robots) {
        app.get('/robots.txt', robots(config))
      }
      app_get(app, staticFiles(config))
      app.use(fallback(config))
      app.listen(port, resolve)
    })
  }
}

function app_get (app, middleware) {
  app.use(function (req, res, next) {
    if (req.method === 'GET') {
      middleware(req, res, next)
    } else {
      next()
    }
  })
}
