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

    if (ua.browser) {
      req.platform = 'web'
    }
    switch (ua.platform) {
      case 'ios':
        req.platform = 'ios'
        break
      case 'android':
        req.platform = 'android'
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
