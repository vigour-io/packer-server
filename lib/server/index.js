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

module.exports = {
  port: undefined,
  app: undefined,
  appHandle: undefined,
  start: function (cfg, packer) {
    config = cfg
    var port = this.port = config.port
    return new Promise((resolve, reject) => {
      this.app = express()
      this.app.use(compress())
      app_get(this.app, ua(config))
      this.app.get('/status', status(config, packer))
      app_get(this.app, headers(config))
      if (config.robots) {
        this.app.get('/robots.txt', robots(config))
      }
      // TEMPORARY START
      if (config.appData) {
        console.log('routing /appData.json to ', config.appData)
        this.app.get('/appData.json', function (req, res, next) {
          console.log('sending', config.appData)
          res.sendFile(config.appData)
        })
      }
      // TEMPORARY END
      app_get(this.app, staticFiles(config))
      this.app.use(fallback(config))
      this.appHandle = this.app.listen(port, '127.0.0.1', resolve)
    })
  },
  stop: function () {
    this.appHandle.close()
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
