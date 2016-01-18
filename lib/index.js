'use strict'

var path = require('path')
var log = require('npmlog')
var Config = require('vigour-config')
var ip = require('ip')
var mailMan = require('mail-man')
var gitSpy = require('git-spy')
var server = require('./server')

module.exports = exports = Packer

function Packer (obsConfig) {
  if (!(obsConfig instanceof Config)) {
    obsConfig = new Config(obsConfig)
  }
  var config = obsConfig.plain()
  config.cwd = process.cwd()
  config.myIP = ip.address()

  if (config.local) {
    config.path = path.isAbsolute(config.local)
      ? config.local
      : path.join(config.cwd, config.local)
  } else {
    var splitRepo = config.repo.split('/')
    config.repoName = splitRepo.pop()
    config.owner = splitRepo.pop()
    config.path = path.join(config.cwd, 'repos', config.repoName, config.branch)
    config.remote = 'git@github.com:' + config.repo + '.git'
    config.callbackURL = `http://${config.myIP}:${config.gitSpyPort}/push`

    config.gs = {
      port: config.gitSpyPort,
      owner: config.owner,
      repo: config.repo,
      apiToken: config.apiToken,
      callbackURL: config.callbackURL
    }

    config.mm = {
      repo: config.repo,
      branch: config.branch,
      path: config.path,
      remote: config.remote,
      gitUsername: config.gitUsername,
      gitPassword: config.gitPassword
    }
  }

  this.config = config
}

Packer.prototype.start = function () {
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
    return mailMan.init(this.config.mm)
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

Packer.prototype.registerGitSpyHooks = function () {
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
    mailMan.update()
      .then(() => log.info('packer-server', 'ready to serve the latest changes'))
      .catch((reason) => {
        // TODO Warn dev
        log.info('packer-server', reason)
      })
  })
}
