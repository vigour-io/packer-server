'use strict'

var log = require('npmlog')
var queryString = require('query-string')
var config

function makeFbImageUrl (originalUrl) {
  return config.shutter +
    '/image?url=' +
    originalUrl +
    '&width=1200' +
    '&height=630'
}

module.exports = function (cfg) {
  config = cfg

  return function (req, res, next) {
    if (req.ua.browser === 'facebook') {
      try {
        log.info('Facebook scraper request', req.pkg)
        var query = queryString.parse(req.query())
        var item
        var meta = {}

        // get defaults
        if (req.pkg.vigour && req.pkg.vigour.fbOGDefaults) {
          if (req.pkg.vigour.fbOGDefaults.title) {
            meta['og:title'] = req.pkg.vigour.fbOGDefaults.title
          }
          if (req.pkg.vigour.fbOGDefaults.description) {
            meta['og:description'] = req.pkg.vigour.fbOGDefaults.description
          }
          if (req.pkg.vigour.fbOGDefaults.image) {
            meta['og:image'] = makeFbImageUrl(req.pkg.vigour.fbOGDefaults.image)
          }
        }

        // replace defaults with data from query string if present
        for (item in query) {
          if (item.indexOf('og:') === 0) {
            if (item === 'og:image') {
              meta[item] = makeFbImageUrl(query[item])
            } else {
              meta[item] = query[item]
            }
          }
        }
        console.log('meta', meta)
        if (meta['og:title'] || meta['og:description'] || meta['og:image']) {
          var str = ''
          for (var prop in meta) {
            str += '<meta property="' +
              prop +
              '" content="' +
              meta[prop] +
              '" />'
          }
          log.info('Sending ', str)
          res.end(str)
        } else {
          throw new Error('No facebook OG data')
        }
      } catch (e) {
        log.warn('Caught', e)
        next()
      }
    } else {
      next()
    }
  }
}
