# packer-server

- Static File Server for the app files
- clones the desired repository in the desired branch
- registers a webhook in github and listens for pushes to the branch
- pulls the latests changes from the branch every time there is a push

## Installation
`$ npm i -g packer-server`

## Usage:
- set up the following environment variables (or assign values another way: see vigour-js/lib/config):
```
PACKER_SERVER_PORT=9090 # the port from where the files are being served
GIT_SPY_PORT=60111 # the port git-spy will listen for the webhooks from github
GIT_SPY_API_TOKEN=<GITHUB OAUTH TOKEN> # this must be created by an organization admin
MAIL_MAN_REPO=<owner>/<repository> # example: vigour-io/packer-server
MAIL_MAN_BRANCH=staging # the branch you want to serve files from
```
- run:
`packer-server`

# how it works:
- mail-man clones the repo/branch in the pwd you launch packer-server from
- git-spy registers a webhook in github to listen for pushes to the repo/branch
- packer-server serves the files from the root of the repository
- git-spy listens for the latest pushes and
- mail-man pulls the latest changes
- packer-server now serves the latest files
Simple as that!
