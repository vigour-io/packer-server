'use strict'

var gitSpy = require('git-spy')
var log = require('npmlog')

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

  gitSpy.on(subscription, (hookData, diffs) => {
    log.info('packer-server', '--------- gitspy fired ----------') // TODO move to git-spy?
    var sha = hookData.after
    if (currentSHA) {
      if (currentSHA === sha) {
        log.info(sha, 'is already being handled')
        return
      }
    }
    currentSHA = sha
    log.info('git-spy', 'received new push - commit:', sha)
    log.info('mail-man', 'pulling the latest changes')
    return this.mailMan.update()
      .then(() => log.info('packer-server', 'ready to serve the latest changes'))
      .catch((reason) => {
        log.info('packer-server', reason)
        return this.warnDev("can't update", reason)
      })
  })
}
