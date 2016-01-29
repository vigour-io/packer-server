'use strict'

module.exports = function (cfg) {
  return function (req, res, next) {
    res.set('Access-Control-Allow-Origin', '*')

    res.set('Cache-Control', 'public, max-age=0')
    res.status(200).send('<pre>' + JSON.stringify(cfg, null, 2) + '</pre>').end()
  }
}
