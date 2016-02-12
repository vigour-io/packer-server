'use strict'

var path = require('path')
var fs = require('vigour-fs-promised')
var config

module.exports = function (cfg) {
  config = cfg

  return function (req, res, next) {
    var url = req.url === '/' || req.url.slice(0, req.url.indexOf('?')) === '/' ? 'build.html' : req.url
    var fullPath = config.local
      ? path.join(config.path, 'dist', req.platform, url)
      : path.join(config.path, config.mmState.live, 'dist', req.platform, url)
    req.headers['user-agent'] && console.log('serving:', fullPath)
    fs.existsAsync(fullPath)
      .then((exists) => {
        if (exists) {
          fs.statAsync(fullPath)
           .then((stat) => {
             if (stat.isDirectory()) {
               res.status(403).send('forbidden')
             } else {
               res.sendFile(fullPath)
             }
           })
        } else {
          res.status(404).send('File or directory not found')
        }
      })
  }
}
