'use strict'

var path = require('path')
var url = require('url')
var log = require('../../logger')
var fs = require('vigour-fs-promised')
var config

function sendTransformedIndex (req, res, next) {
  var languages = req.pkg && req.pkg.vigour && req.pkg.vigour.languages
    ? req.pkg.vigour.languages
    : []
  fs.readFileAsync(req.fullPath, 'utf8')
    .then((data) => {
      data = data.replace()
      var re = /(?:\?|&)lang=([a-zA-Z]{2})/
      var match = req.originalUrl.match(re)
      var pageLang = match
        ? match[1]
        : 'en'
      var base = req.originalUrl.replace(re, '')
      var insert = '\n'
      var langPart = base.indexOf('?') === -1
        ? '?lang='
        : '&lang='
      for (var key in languages) {
        let lang = languages[key]
        let hreflang = lang === pageLang
          ? 'x'
          : lang
        insert += `<link rel="alternate" hreflang="${hreflang}" href="http://${req.headers.host}${base}${langPart}${lang}" />\n`
      }

      insert += `<link rel="canonical" href="http://${req.headers.host}${base}" />\n`
      insert += '</head>'
      data = data.replace('</head>', insert)
      res.write(data)
      res.end()
    })
}

module.exports = function (cfg) {
  config = cfg

  return function serveStaticFile (req, res, next) {
    var servingIndex = false
    req.pathname = req.pathname || url.parse(req.url).pathname
    // if path is `/` or has no extension
    if (req.pathname === '/' || req.pathname.lastIndexOf('.') < req.pathname.lastIndexOf('/')) {
      // serve entry (app main page)
      servingIndex = true
      req.pathname = config.entry
    } else {
      req.pathname = req.pathname
    }
    req.fullPath = config.local
      ? path.join(config.path, 'dist', req.platform, req.pathname)
      : path.join(config.path, config.mmState.live, 'dist', req.platform, req.pathname)
    // log requests, except for haproxy requests which ship without a user-agent
    req.headers['user-agent'] && log.trace('serving: %s', req.fullPath)
    fs.existsAsync(req.fullPath)
      .then((exists) => {
        if (exists) {
          fs.statAsync(req.fullPath)
            .then((stat) => {
              if (stat.isDirectory()) {
                res.status(403).send('forbidden')
              } else {
                if (servingIndex) {
                  sendTransformedIndex(req, res, next)
                } else {
                  res.sendFile(req.fullPath)
                }
              }
            })
        } else if (config.findAssets) {
          if (config.verbose) {
            log.warn("Can't find %s", req.pathname)
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
            log.info('retrying with %s', req.pathname)
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
