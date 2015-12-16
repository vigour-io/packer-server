var path = require('path')
var UA = require('vigour-ua')

module.exports = exports = function (config) {
  return function (req, res, next) {
    var uaString = req.headers['user-agent']
    console.log('uaString', uaString)
    var ua = UA(uaString)
    console.log(ua)

    switch (ua.platform) {
      case 'ios':
        req.platformWww = path.join('ios', 'vigour-native', 'www')
        break
      case 'android':
        req.platformWww = path.join('android', 'app', 'src', 'main', 'assets')
        break
      case 'samsung':
        req.platformWww = 'samsungtv'
        break
      case 'lg':
        req.platformWww = 'lg'
        break
      default:
        req.platformWww = 'web'
        break
    }
    next()
  }
}
