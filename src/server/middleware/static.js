var path = require('path')
var fs = require('vigour-fs-promised')
// var UA = require('vigour-ua')
var mime = require('mime')
var config

module.exports = function (cfg) {
  config = cfg
  var basePath = path.join(config.path, 'dist')

  return function (req, res, next) {
    var url = req.url === '/' ? 'build.html' : req.url
    console.log('serving:', url)
    var fullPath = path.join(basePath, url)
    fs.existsAsync(fullPath)
      .then((exists) => {
        if (exists) {
          res.setHeader('Content-Type', mime.lookup(fullPath))
          fs.createReadStream(fullPath)
            .pipe(res)
        } else {
          res.status(404).send('File or directory not found')
        }
      })
  }
}

// var getPlatform = function (req) {
//   var uaString = req.headers['user-agent']
//   console.log('uaString', uaString)
//   var ua = UA(uaString)
//   console.log(ua)
//
//   var returns
//   switch (ua.platform) {
//     case 'ios':
//       returns = 'ios'
//       break
//     case 'android':
//       returns = 'android'
//       break
//     case 'samsung':
//       returns = 'samsungtv'
//       break
//     case 'lg':
//       returns = 'lg'
//       break
//     default:
//       returns = 'web'
//       break
//   }
//   return returns
// }
