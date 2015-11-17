var path = require('path')
var fs = require('vigour-fs-promised')
var log = require('npmlog')
var exec = require('../../utils/exec')
var config

var Github = module.exports = {
	init: function(cfg){
		config = cfg
		return Github.updateRepo()
	}, 
	updateRepo: function(){
		return checkIfRepoCloned()
			.then(cloneRepo)
			.then(changeDir)
			.then(pullBranch)
			.then(npmInstall)
			.then(changeDirBack)
			.then(() => console.log('SUCCESS'))
			.catch((err) => console.log(err.stack))
	}
}

var npmInstall = function(){
	console.log('$ npm update')
	return exec('npm update', true)
}

var changeDir = function(){
	console.log(`$ cd ${config.repoPath}`)
	return process.chdir(config.repoPath)
}

var changeDirBack = function(){
	console.log('$ cd ..')
	return process.chdir('..')
}

var pullBranch = function(shouldPull){
	console.log(`$ git pull origin ${config.repo.branch.val}`)
	return exec(`git pull origin ${config.repo.branch.val}`, true)
}

var cloneRepo = function(isCloned){
	if(isCloned){
		return true
	}
	var address = config.repo.address.val
	var branch = config.repo.branch.val
	console.log(`$ git clone --branch=${branch} --depth=10 ${address}`)
	var cmd = `git clone --branch=${branch} --depth=10 ${address}`
	return exec(cmd, true)
}


var checkIfRepoCloned = function(){
	var address = config.repo.address.val
	config.repoPath = '' + path.basename(address).replace(/\..+/, '')
	return fs.existsAsync(config.repoPath)
}
