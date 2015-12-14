var UA = require('vigour-ua')

module.exports = exports = function (config) {
  return function (req, res, next) {
    var uaString = req.headers['user-agent']
    console.log('uaString', uaString)
    var ua = UA(uaString)
    console.log(ua)

    switch (ua.platform) {
      case 'ios':
        req.detectedPlatform = 'ios'
        break
      case 'android':
        req.detectedPlatform = 'android'
        break
      case 'samsung':
        req.detectedPlatform = 'samsungtv'
        break
      case 'lg':
        req.detectedPlatform = 'lg'
        break
      default:
        req.detectedPlatform = 'web'
        break
    }
    next()
  }
}
