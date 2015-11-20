var path = require('path')
var fs = require('vigour-fs-promised')
var UA = require('vigour-ua')
var mime = require('mime')
var config

module.exports = function(cfg){
	config = cfg
	var basePath = config.path
	console.log('basePath', basePath)
	return function(req, res, next){
		var url = req.url === '/'? 'build.html' : req.url
		var fullPath = path.join(basePath, url)
		fs.existsAsync(fullPath)
			.then((exists) => {
				if(exists){
					res.setHeader("Content-Type", mime.lookup(fullPath))
					fs.createReadStream(fullPath)
						.pipe(res)
				} else {
					res.status(404).send('File or directory not found')
				}
			})
	}
}

var getPlatform = function(req){
	var uaString = req.headers['user-agent']
	console.log('uaString', uaString)
	var ua = UA(uaString)
	console.log(ua)

	switch(ua.platform){
		case 'ios': 
			return 'ios'
			break
		case 'android': 
			return 'android'
			break
		case 'samsung':
			return 'samsungtv'
			break
		case 'lg':
			return 'lg'
			break
		default:
			return 'web'
			break
	}
}
