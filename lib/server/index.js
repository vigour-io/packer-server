'use strict'

var path = require('path')
var log = require('../logger')
var fs = require('vigour-fs-promised')
var express = require('express')
var compress = require('compression')
var ua = require('./middleware/ua')
var logRequest = require('./middleware/logrequest')
var status = require('./middleware/status')
var headers = require('./middleware/headers')
var robots = require('./middleware/robots')
var fbMeta = require('./middleware/fbmeta')
var staticFiles = require('./middleware/static')
var fallback = require('./middleware/fallback')
var config

module.exports = {
  port: undefined,
  app: undefined,
  appHandle: undefined,
  pkg: undefined,
  start: function (cfg, packer) {
    config = cfg
    var port = this.port = config.port
    return new Promise((resolve, reject) => {
      this.app = express()
      this.app.use(compress())
      app_get(this.app, ua(config))
      if (config.verbose) {
        this.app.use(logRequest(config))
      }
      this.app.get('/_api/config', status.getConfig(config, packer))
      this.app.get('/_api/status', status.getStatus)
      app_get(this.app, headers(config))
      if (config.robots) {
        this.app.get('/robots.txt', robots(config))
      }
      // TEMPORARY START
      if (config.appData) {
        if (config.verbose) {
          log.info('routing /appData.json to %s', config.appData)
        }
        this.app.get('/appData.json', function (req, res, next) {
          res.sendFile(config.appData)
        })
      }
      // TEMPORARY END
      this.app.use((req, res, next) => {
        this.getPkg()
          .then((pkg) => {
            req.pkg = pkg
            next()
          }, (err) => {
            log.warn({err: err}, 'Error getting package')
            req.pkg = {}
            next()
          })
      })
      this.app.use(fbMeta(config))
      app_get(this.app, staticFiles(config))
      this.app.use(fallback(config))
      this.appHandle = this.app.listen(port, '127.0.0.1', resolve)
    })
  },
  stop: function () {
    this.appHandle.close()
  },
  getPkg: function (force) {
    if (this.pkg && !force) {
      return Promise.resolve(this.pkg)
    } else {
      return fs.readJSONAsync(path.join(config.path, config.mmState.live, 'package.json'))
        .then((pkg) => {
          this.pkg = pkg
          return this.pkg
        })
    }
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
