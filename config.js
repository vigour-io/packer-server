var config = module.exports = {
	port: process.env.PACKER_SERVER_PORT,
	gitSpyPort: process.env.GIT_SPY_PORT,
	apiToken: process.env.GIT_SPY_API_TOKEN,
	callbackURL: process.env.GIT_SPY_CALLBACK_URL,
	repo: process.env.MAIL_MAN_REPO,
	branch: process.env.MAIL_MAN_BRANCH,
}

var splitRepo = config.repo.split('/')
config.repoName = splitRepo.pop()
config.owner = splitRepo.pop()
config.path = '../' + config.repoName
config.remote = 'git@github.com:' + config.repo + '.git'

