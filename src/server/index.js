var express = require('express')
var static = require('./middleware/static')
var config

var Server = module.exports = {
	port: undefined,
	app: undefined,
	start: function(cfg){
		config = cfg
		var port = this.port = config.port
		return new Promise((resolve, reject) => {
			var app = Server.app = express()
			app.use(static(config))
			app.listen(port, resolve)
		})
	}
}