'use strict'

var _cloneDeep = require('lodash/lang/cloneDeep')
const replacer = 'CONFIDENTIAL'
var clone

module.exports.getConfig = function (cfg, packer) {
  return function (req, res, next) {
    clone = _cloneDeep(packer.config)
    clone.apiToken = replacer
    clone.gitUsername = replacer
    clone.gitPassword = replacer
    clone.gs.apiToken = replacer
    clone.gs.gitUsername = replacer
    clone.gs.gitPassword = replacer
    clone.gs.gwfUser = replacer
    clone.gs.gwfPass = replacer
    clone.mm.apiToken = replacer
    clone.mm.gitUsername = replacer
    clone.mm.gitPassword = replacer
    clone.mm.apiHeaders.Authorization = replacer
    if (clone.slack) {
      clone.slack.id = replacer
    }
    res.set('Access-Control-Allow-Origin', '*')
    res.set('Cache-Control', 'public, max-age=0')

    res.status(200).send('<pre>' + JSON.stringify(clone, null, 2) + '</pre>').end()
  }
}

module.exports.getStatus = function (req, res, next) {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Cache-Control', 'public, max-age=0')
  res.status(200).send('')
}
