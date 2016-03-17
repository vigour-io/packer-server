# packer-server

- Static File Server for the app files
- clones the desired repository in the desired branch
- listens for pushes to the branch (see [git-spy](https://github.com/vigour-io/git-spy) and [github-webhook-forwarding](https://github.com/vigour-io/github-webhook-forwarding))
- pulls the latests changes from the branch every time there is a push
- more (TODO: document it)

## Installation
`$ npm i -g packer-server`

## Usage:
See the [vigour-config docs](https://github.com/vigour-io/config#readme) for information on how to configure and launch the packer-server and where to get more info for all the configuration options.

As a minimum, you must set the following configuration options

- `repo` (`MAIL_MAN_REPO`)
- `branch` (`MAIL_MAN_BRANCH`)
- `gwfURL` (`GIT_SPY_GWF_URL`)
- `gwfUser` (`GIT_SPY_GWF_USER`)
- `gwfPass` (`GIT_SPY_GWF_PASS`)

You will probably also want to set the following unless you're just launching a single packer locally for testing

- `port` (`PACKER_SERVER_PORT`)
- `gitSpyPort` (`GIT_SPY_PORT`)

Other options are available (see [the package](package.json))

# how it works:
- mail-man clones the specified branch of the specified repo in the directory where you launched packer-server
- git-spy subscribes to the repo and branch on the github-webhook-forwarding process reachable via `gwfURL`, which registers a WebHook on GitHub to listen for pushes
- packer-server serves the files found at `dist/<platform>` of the cloned repo, where `<platform>` is selected by looking at the request's `User-Agent` header
- When a push is made to the specified repo and branch, the packer will pull and serve the new version automatically
