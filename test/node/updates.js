'use strict'

var path = require('path')
var _merge = require('lodash/object/merge')
var fs = require('vigour-fs-promised')
var Packer = require('../../')
var options = {
  repo: 'vigour-io/abu-dhabi-media',
  branch: 'develop-dist',
  port: 50000,
  gitSpyPort: 50001,
  verbose: true
}
var packer

describe('config', () => {
  before(function () {
    this.timeout(10000)
    return cleanup()
      .then(() => {
        return fs.readJSONAsync(path.join(__dirname, '..', '..', 'configs', 'github.json'))
      })
      .then((confidential) => {
        _merge(options, confidential)
        packer = new Packer(options)
        return packer.start(confidential)
      })
  })
  it('should be able to get the config', function () {
    expect(packer.config.mmState[packer.config.mmState.live].sha).to.exist
  })
  after(function () {
    return packer.stop()
      .then(() => {
        return cleanup()
      })
  })
})
//
// function wait (time) {
//   return new Promise(function (resolve, reject) {
//     setTimeout(function () {
//       resolve()
//     }, time)
//   })
// }
function cleanup () {
  return fs.removeAsync(path.join(__dirname, '..', '..', 'repos'))
}
