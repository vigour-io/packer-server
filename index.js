var log = require('npmlog')
var packerServer = require('./src')
var config = require('./config')

var gsConfig = {
  port: config.gitSpyPort,
  owner: config.owner,
  repo: config.repo,
  apiToken: config.apiToken,
  callbackURL: config.callbackURL
}

var mmConfig = {
  repo: config.repo,
  branch: config.branch,
  path: config.path,
  remote: config.remote
}

packerServer.init(config, gsConfig, mmConfig)
  .then(() => log.info('packer-server', 'launched successfully'))
  .catch((err) => log.error('packer-server', err))
