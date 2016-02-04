'use strict'

var _cloneDeep = require('lodash/lang/cloneDeep')
const replacer = 'CONFIDENTIAL'

module.exports = function (cfg) {
  return function (req, res, next) {
    var clone = _cloneDeep(cfg)
    clone.apiToken = replacer
    clone.gitUsername = replacer
    clone.gitPassword = replacer
    clone.gs.apiToken = replacer
    clone.gs.gitUsername = replacer
    clone.gs.gitPassword = replacer
    clone.mm.apiToken = replacer
    clone.mm.gitUsername = replacer
    clone.mm.gitPassword = replacer
    clone.mm.apiHeaders.Authorization = replacer
    res.set('Access-Control-Allow-Origin', '*')
    res.set('Cache-Control', 'public, max-age=0')

    res.status(200).send('<pre>' + JSON.stringify(clone, null, 2) + '</pre>').end()
  }
}
