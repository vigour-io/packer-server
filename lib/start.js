'use strict'

var log = require('./logger')

module.exports = exports = function () {
  log.info('starting packer server')
  var config = this.config
  if (config.local) {
    return this.server.start(config)
      .then(() => {
        log.info('server listening on port %s', config.port)
      })
  } else {
    log.debug({repo: config.repo, branch: config.branch}, 'pckaer server configured')
    return this.mailMan.init(this.config.mm)
      .then((mmState) => {
        this.config.mmState = mmState
        return this.gitSpy.init(this.config.gs)
      })
      .then(() => {
        return this.server.start(this.config, this)
      })
      .then(() => {
        log.info('server listening on port %s', config.port)
        return this.registerGitSpyHooks()
      })
      .then(() => {
        log.info('server setup succeeded')
      })
  }
}
