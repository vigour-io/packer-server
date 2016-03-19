'use strict'

var path = require('path')
var fs = require('vigour-fs-promised')
var Packer = require('../../')
var options = {
  repo: 'vigour-io/example',
  branch: 'develop-dist',
  port: 50000,
  gitSpyPort: 50001,
  verbose: true
}
var packer

describe('config', () => {
  before(function () {
    this.timeout(20000)
    return cleanup()
      .then(() => {
        packer = new Packer(options)
        return packer.start()
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
