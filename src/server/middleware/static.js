var path = require('path')
var fs = require('vigour-fs-promised')
var UA = require('vigour-ua')
var mime = require('mime')
var config

module.exports = function (cfg) {
  config = cfg
  var basePath = path.join(config.path, 'dist')

  return function (req, res, next) {
    var url = req.url === '/' ? 'build.html' : req.url
    // console.log('serving:', url)
    var platform = getPlatform(req)
    var fullPath = path.join(basePath, platform, url)
    fs.existsAsync(fullPath)
      .then((exists) => {
        if (exists) {
          fs.statAsync(fullPath)
            .then((stat) => {
              if (stat.isDirectory()) {
                res.status(403).send('forbidden')
              } else {
                res.setHeader('Content-Type', mime.lookup(fullPath))
                fs.createReadStream(fullPath)
									.pipe(res)
              }
            })
        } else {
          res.status(404).send('File or directory not found')
        }
      })
  }
}

var getPlatform = function (req) {
  var uaString = req.headers['user-agent']
  // console.log('uaString', uaString)
  var ua = UA(uaString)
	// console.log(ua)

  switch (ua.platform) {
    case 'ios':
      return 'ios'
    case 'android':
      return 'android'
    case 'samsung':
      return 'samsungtv'
    case 'lg':
      return 'lg'
    default:
      return 'web'
  }
}
