var path = require('path')
var UA = require('vigour-ua')

module.exports = exports = function (config) {
  return function (req, res, next) {
    var uaString = req.headers['user-agent']

    if(!uaString){
      req.platform = 'web'
      req.platformWww = 'web'
      return next()
    }

    var ua = UA(uaString)

    if (ua.browser) {
      req.platform = 'web'
      req.platformWww = 'web'
    }
    switch (ua.platform) {
      case 'ios':
        req.platform = 'ios'
        req.platformWww = path.join('ios', 'vigour-native', 'www')
        break
      case 'android':
        req.platform = 'android'
        req.platformWww = path.join('android', 'app', 'src', 'main', 'assets')
        break
      case 'samsung':
        req.platform = 'samsung'
        req.platformWww = 'samsungtv'
        break
      case 'lg':
        req.platform = 'lg'
        req.platformWww = 'lg'
        break
      default:
        req.platform = 'web'
        req.platformWww = 'web'
        break
    }
    next()
  }
}
