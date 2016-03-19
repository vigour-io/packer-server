'use strict'

var log = require('npmlog')

module.exports = exports = function () {
  if (this.config.local) {
    return this.server.start(this.config)
      .then(() => {
        log.info('packer-server', `is listening on port ${this.config.port}`)
        log.info('packer-server', 'launched successfully')
      })
  } else {
    log.info('packer-server', ' Repo:', this.config.repo + '#' + this.config.branch)
    log.info('packer-server', 'launching mail-man')
    return this.mailMan.init(this.config.mm)
      .then((mmState) => {
        log.info('mail-man', 'up and running', mmState) // TODO move to mail-man?
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
        log.info('packer-server', `is listening on port ${this.config.port}`)
        log.info('packer-server', 'registering git-spy hooks')
        return this.registerGitSpyHooks()
      })
      .then(() => {
        log.info('packer-server', 'launched successfully')
      })
      .catch((reason) => {
        log.error('packer-server', reason)
        throw reason
      })
  }
}
