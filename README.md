# packer-server

- Static File Server for the app files
- clones the desired repository in the desired branch
- listens for pushes to the branch (see [git-spy](https://github.com/vigour-io/git-spy) and [github-webhook-forwarding](https://github.com/vigour-io/github-webhook-forwarding))
- pulls the latests changes from the branch every time there is a push
- more (TODO: document it)

## Installation
`$ npm i -g packer-server`

## Usage:
See [configure and launch your service](https://github.com/vigour-io/config#configure-and-launch-your-service) in [`vigour-config`](https://github.com/vigour-io/config#readme) for information on how to configure and launch the packer-server and where to get more info for all the configuration options.

## `npm start`

As a minimum, you must set the following configuration options:

- `repo` (`MAIL_MAN_REPO`)
- `branch` (`MAIL_MAN_BRANCH`)
- `gwfURL` (`GIT_SPY_GWF_URL`)
- `gwfUser` (`GIT_SPY_GWF_USER`)
- `gwfPass` (`GIT_SPY_GWF_PASS`)

If serving an app found in a private repository, make sure you have the permissions to access it via the `git` command (this is what packer-server uses internally).

You will probably also want to set the following unless you're just launching a single packer locally for testing.

- `port` (`PACKER_SERVER_PORT`)
- `gitSpyPort` (`GIT_SPY_PORT`)

Other options are available (see [the package](package.json))

## `npm test`

Some of the tests will launch a real packer, which will try to subscribe to a github-webhook-forwarding service and need its URL and proper credentials. credentials we don't want to put in the repo. Please set the following environment variables instead:

- `GWF_TEST_OWNER`
- `GWF_TEST_USER`
- `GWF_TEST_PASS`
- `GWF_TEST_PORT` (optional, default: `8000`)

example:
```sh
$ export GWF_TEST_OWNER=vigour
$ export GWF_TEST_USER=vigourbot
$ export GWF_TEST_PASS=OMGthisissoooooosecret
```

# how it works:
- mail-man clones the specified branch of the specified repo in the directory where you launched packer-server.
- git-spy subscribes to the repo and branch on the github-webhook-forwarding process reachable via `gwfURL`, which registers a WebHook on GitHub to listen for pushes.
- packer-server serves the files found at `dist/<platform>` of the cloned repo, where `<platform>` is selected by looking at the request's `User-Agent` header.
- When a push is made to the specified repo and branch, the packer will pull and serve the new version automatically.
