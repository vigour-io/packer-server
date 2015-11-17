var config
var log = require('npmlog')
var server = require('./server')
var github = require('./integration/github')

var Packer = module.exports = {
	init: function(cfg){
		config = cfg

		return github.init(config)
			.then(() => server.start(config))
			.then(() => log.info('Packer-Server', `is listening on port ${server.port}`))
	}
}
