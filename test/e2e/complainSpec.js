const config = require('config')
const path = require('path')
const utils = require('../../lib/utils')

describe('/#/complain', () => {
  let file, complaintMessage, submitButton

  protractor.beforeEach.login({ email: 'admin@' + config.get('application.domain'), password: 'admin123' })

  beforeEach(() => {
    browser.get('/#/complain')
    file = element(by.id('file'))
    complaintMessage = element(by.id('complaintMessage'))
    submitButton = element(by.id('submitButton'))
  })

  describe('challenge "uploadSize"', () => {
    it('should be possible to upload files greater 100 KB directly through backend', () => {
      browser.waitForAngularEnabled(false)
      browser.executeScript(() => {
        const over100KB = Array.apply(null, new Array(11000)).map(String.prototype.valueOf, '1234567890')
        const blob = new Blob(over100KB, { type: 'application/pdf' })

        const data = new FormData()
        data.append('file', blob, 'invalidSizeForClient.pdf')

        const request = new XMLHttpRequest()
        request.open('POST', '/file-upload')
        request.send(data)
      })
      browser.driver.sleep(1000)
      browser.waitForAngularEnabled(true)
    })
    protractor.expect.challengeSolved({ challenge: 'Upload Size' })
  })

})
