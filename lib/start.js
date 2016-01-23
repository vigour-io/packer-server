var log = require('npmlog')
var server = require('./server')
var gitSpy = require('git-spy')

module.exports = exports = function () {
  if (this.config.local) {
    return server.start(this.config)
      .then(() => {
        log.info('packer-server', `is listening on port ${this.config.port}`)
        log.info('packer-server', 'launched successfully')
      })
  } else {
    log.info('packer-server', 'launching git-spy') // TODO move to git-spy?
    log.info('packer-server', ' Repo:', this.config.repo + '#' + this.config.branch)
    log.info('packer-server', 'launching mail-man')
    return this.mailMan.init(this.config.mm)
      .then((mmState) => {
        this.config.mmState = mmState
        log.info('mail-man', 'up and running', mmState) // TODO move to mail-man?
        log.info('packer-server', 'launching git-spy')
        return gitSpy.init(this.config.gs)
      })
      .then(() => {
        log.info('git-spy', `listening on port ${this.config.gs.port}`) // TODO move to git-spy?
        log.info('packer-server', 'launching server')
        return server.start(this.config)
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