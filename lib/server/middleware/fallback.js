'use strict'

module.exports = function (cfg) {
  return function (req, res, next) {
    res.status(200).end()
  }
}
