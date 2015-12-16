var express = require('express')
var compress = require('compression')
var ua = require('./middleware/ua')
var headers = require('./middleware/headers')
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
      app.use(ua(config))
      app.use(headers(config))
      app.use(staticFiles(config))
      app.listen(port, resolve)
    })
  }
}
