var UA = require('vigour-ua')

module.exports = function(req, res, next){
	var platform = getPlatform(req)
	res.send('ok')
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
