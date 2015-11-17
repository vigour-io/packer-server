var config

var Packer = module.exports = {
	init: function(cfg){
		config = cfg
		console.log('port', config.port.val)
	}
}