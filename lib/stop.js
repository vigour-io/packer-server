'use strict'

module.exports = exports = function () {
  if (this.config.local) {
    return this.server.stop()
  } else {
    return this.gitSpy.stop()
      .then(() => {
        this.server.stop()
      })
  }
}
