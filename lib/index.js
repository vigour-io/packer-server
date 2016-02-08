'use strict'

var path = require('path')
var Config = require('vigour-config')
var ip = require('ip')

module.exports = exports = Packer

function Packer (obsConfig) {
  if (!(obsConfig instanceof Config)) {
    obsConfig = new Config(obsConfig)
  }
  var config = obsConfig.plain()
  config.cwd = process.cwd()
  config.myIP = ip.address()
  if (config.appData) {
    config.appData = config.appData.replace('~', process.env.HOME)
  }

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
      callbackURL: config.callbackURL,
      gitUsername: config.gitUsername,
      gitPassword: config.gitPassword,
      verbose: config.verbose
    }

    config.mm = {
      repo: config.repo,
      branch: config.branch,
      path: config.path,
      remote: config.remote,
      apiToken: config.apiToken,
      gitUsername: config.gitUsername,
      gitPassword: config.gitPassword,
      verbose: config.verbose
    }
  }

  this.config = config
}

Packer.prototype.mailMan = require('mail-man')
Packer.prototype.start = require('./start')
Packer.prototype.registerGitSpyHooks = require('./registergitspyhooks')
Packer.prototype.warnDev = require('./warnDev')
