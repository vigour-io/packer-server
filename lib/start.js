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
        if (this.config.gs.gwfURL && this.config.gs.gwfUser && this.config.gs.gwfPass) {
          log.info('packer-server', 'launching git-spy') // TODO move to git-spy?
          return this.gitSpy.init(this.config.gs)
            .then(() => {
              log.info('git-spy', `listening on port ${this.config.gs.port}`) // TODO move to git-spy?
            })
        } else {
          log.warn('packer-server', "Won't listen for updates. To listen for updates, use the `gwfURL`, `gwfUser` and `gwfPass` options.")
        }
      })
      .then(() => {
        log.info('packer-server', 'launching server')
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
