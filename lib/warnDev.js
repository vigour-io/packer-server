'use strict'

var https = require('https')
var log = require('./logger')

module.exports = exports = function (msg, _info) {
  log.warn({info: _info}, 'packer server alarm')
  var info = _info.toString() + ' '
  try {
    info += JSON.stringify(_info, null, 2)
  } catch (ex) {
    info += info.toString()
  }
  return new Promise((resolve, reject) => {
    var error
    if (!this.config.slack) {
      error = new Error('Slack misconfigured')
      error.todo = 'set slack.id and slack.channel'
      return reject(error)
    }
    if (!this.config.slack.channel) {
      error = new Error('Slack misconfigured')
      error.todo = 'set slack.channel'
      return reject(error)
    }
    var channel = this.config.slack.channel
    if (channel.indexOf('#') !== '0') {
      channel = '#' + channel
    }
    if (!this.config.slack.id) {
      error = new Error('Slack misconfigured')
      error.todo = 'set slack.id'
      return reject(error)
    }
    var postData = 'payload=' + JSON.stringify({
      username: this.config.myIP + ':' + this.config.port +
        ' (' + this.config.repo + '#' + this.config.branch + ') ',
      text: msg + '\n' + info,
      channel: channel
    })
    var options = {
      hostname: 'hooks.slack.com',
      port: 443,
      path: '/services/' + this.config.slack.id,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length
      }
    }

    log.debug({reqOptions: JSON.stringify(options, null, 2)}, 'sending slack message')

    var req = https.request(options, (res) => {
      var response = ''
      res.on('error', reject)
      res.on('data', (chunk) => {
        response += chunk.toString()
      })
      res.on('end', () => {
        var err
        if (response === 'ok') {
          log.info('slack message sent to %s', channel)
          return resolve()
        } else {
          err = new Error('Slack not OK')
          err.response = response
          err.TODO = 'Check slack id and channel'
          return reject(err)
        }
      })
    })
    req.on('error', reject)
    req.write(postData)
    req.end()
  })
}
