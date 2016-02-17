'use strict'

var path = require('path')
var url = require('url')
var log = require('npmlog')
var fs = require('vigour-fs-promised')
var config

module.exports = function (cfg) {
  config = cfg

  return function serveStaticFile (req, res, next) {
    req.pathname = req.pathname || url.parse(req.url).pathname
    if (req.pathname === '/' || req.pathname.lastIndexOf('.') < req.pathname.lastIndexOf('/')) {
      req.pathname = config.entry
    } else {
      req.pathname = req.pathname
    }
    var fullPath = config.local
      ? path.join(config.path, 'dist', req.platform, req.pathname)
      : path.join(config.path, config.mmState.live, 'dist', req.platform, req.pathname)
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
        } else if (config.findAssets) {
          if (config.verbose) {
            log.warn("Can't find", req.pathname)
          }
          let idx = req.pathname.indexOf('/')
          if (idx !== -1) {
            req.pathname = req.pathname.slice(idx + 1)
            if (idx === 0) {
              let newIdx = req.pathname.indexOf('/')
              if (newIdx !== -1) {
                req.pathname = req.pathname.slice(newIdx)
              }
            }
            log.info('retrying with', req.pathname)
            serveStaticFile(req, res, next)
          } else {
            res.status(404).send('File or directory not found')
          }
        } else {
          res.status(404).send('File or directory not found')
        }
      })
  }
}
