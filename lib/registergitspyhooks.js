'use strict'

var gitSpy = require('git-spy')
var log = require('./logger')

module.exports = exports = function () {
  var currentSHA
  var repo = this.config.repoName
  var branch = this.config.branch
  var subscription = {
    [repo]: {
      [branch]: {
        'package.json': true
      }
    }
  }
  // subscription[repo] = {}
  // subscription[repo][branch] = {
  //   'package.json': true
  // }

  return gitSpy.on(subscription, (hookData, diffs) => {
    log.info('git spy fired') // TODO move to git-spy?
    var sha = hookData.after
    if (currentSHA && currentSHA === sha) {
      log.info({sha: sha}, 'commit already being handled')
      return
    }
    currentSHA = sha
    log.info({commit: sha}, 'received new push from commit')
    return this.mailMan.update()
      .then((mmState) => {
        log.debug({mmState: mmState}, 'mail-man state')
        this.config.mmState = mmState
        return this.server.getPkg(true)
      })
      .then(() => {
        log.info('packer ready to serve the latest changes')
      })
      .catch((err) => {
        log.error({err: err}, 'Error on mail-man upate')
        return this.warnDev("can't update", err)
      })
  })
}
