'use strict'

module.exports = function (cfg) {
  return function (req, res, next) {
    res.set('Access-Control-Allow-Origin', '*')

    // Cache headers
    var maxage = 31556900  // ~ 1 year in seconds
    res.set('Cache-Control', (cfg && cfg.cache)
      ? 'public, no-transform, max-age=' + maxage
      : 'public, max-age=0')

    // CDN-specific headers
    if (cfg && cfg.akamai) {
      res.set('Edge-Control', (cfg && cfg.cdnCache)
        ? '!no-cache, max-age=' + maxage
        : 'public, max-age=0')
    }
    next()
  }
}
