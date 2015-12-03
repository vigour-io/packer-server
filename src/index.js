var config
var log = require('npmlog')
var mailMan = require('mail-man')
var gitSpy = require('git-spy')
var server = require('./server')

var Packer = module.exports = {
	init: function(cfg, gsConfig, mmConfig){
		config = cfg
		log.info('packer-server', 'launching git-spy')
		log.info('packer-server', ' Repo:', config.repo, '- Branch:', config.branch)
		return gitSpy.init(gsConfig)
			.then(() => log.info('git-spy', `listening on port ${gsConfig.port}`))
			.then(() => log.info('packer-server', 'launching mail-man'))
			.then(() => mailMan.init(mmConfig))
			.then(() => log.info('mail-man', 'up and running'))
			.then(() => log.info('packer-server', 'starting server'))
			.then(() => server.start(config))
			.then(() => log.info('Packer-Server', `is listening on port ${config.port}`))
			.then(() => log.info('packer-server', 'registering git-spy hook'))
			.then(registerGitSpyHook)
	}
}

var registerGitSpyHook = function(){
	var currentSHA = undefined
	var repo = config.repoName
	var branch = config.branch
	var subscription = {}
	subscription[repo] = {}
	subscription[repo][branch] = true
	gitSpy.on(subscription, (hookData, diffs) => {
		console.log('--------- gitspy fired ----------')
		var sha = hookData.after
		if(currentSHA){
			if(currentSHA === sha){
				log.info(sha, 'is already being handled')
				return
			}
		}
		currentSHA = sha
		log.info('git-spy', 'received new push - commit:', sha)
		log.info('mail-man', 'pulling the latest changes')
		mailMan.update()
			.then(() => log.info('packer-server', 'ready to serve the latest changes'))
			.catch(() => log.info('packer-server', err))
	})
}