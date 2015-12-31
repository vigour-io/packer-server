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

  var splitRepo = config.repo.split('/')
  config.repoName = splitRepo.pop()
  config.owner = splitRepo.pop()
  config.cwd = process.cwd()
  config.pid = process.pid
  config.path = path.join(config.cwd, config.repoName)
  config.remote = 'git@github.com:' + config.repo + '.git'

  config.myIP = ip.address()
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
    remote: config.remote
  }

  this.config = config
}

Packer.prototype.start = function () {
  log.info('packer-server', 'pid:', this.config.pid)
  log.info('packer-server', 'launching git-spy') // TODO move to git-spy?
  log.info('packer-server', ' Repo:', this.config.repo + '#' + this.config.branch)
  return gitSpy.init(this.config.gs)
    .then(() => {
      log.info('git-spy', `listening on port ${this.config.gs.port}`) // TODO move to git-spy?
      log.info('packer-server', 'launching mail-man')
      return mailMan.init(this.config.mm)
    })
    .then(() => {
      log.info('mail-man', 'up and running') // TODO move to mail-man?
      log.info('packer-server', 'starting server')
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
    .catch((err) => log.error('packer-server', err))
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
      .catch((reason) => log.info('packer-server', reason))
  })
}
