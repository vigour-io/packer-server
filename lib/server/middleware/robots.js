'use strict'

var path = require('path')
var pth = path.join(__dirname, 'robots.txt')

module.exports = function () {
  return function (req, res, next) {
    res.sendFile(pth)
  }
}
