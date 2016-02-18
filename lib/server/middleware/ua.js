'use strict'

var UA = require('vigour-ua')

module.exports = exports = function (config) {
  return function (req, res, next) {
    var uaString = req.headers['user-agent']

    if (!uaString) {
      req.platform = 'web'
      req.ua = {}
      return next()
    }

    var ua = req.ua = UA(uaString)

    req.platform = 'web'
    switch (ua.platform) {
      case 'ios':
        if (ua.webview) {
          req.platform = 'ios'
        }
        break
      case 'android':
        if (ua.webview) {
          req.platform = 'android'
        }
        break
      case 'samsung':
        req.platform = 'samsung'
        break
      case 'lg':
        req.platform = 'lg'
        break
      default:
        req.platform = 'web'
        break
    }
    next()
  }
}
