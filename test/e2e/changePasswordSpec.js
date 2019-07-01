const config = require('config')

describe('/#/privacy-security/change-password', () => {
  let currentPassword, newPassword, newPasswordRepeat, changeButton

  describe('as Morty', () => {
    protractor.beforeEach.login({ email: 'morty@' + config.get('application.domain'), password: 'focusOnScienceMorty!focusOnScience' })

    beforeEach(() => {
      browser.get('/#/privacy-security/change-password')
      currentPassword = element(by.id('currentPassword'))
      newPassword = element(by.id('newPassword'))
      newPasswordRepeat = element(by.id('newPasswordRepeat'))
      changeButton = element(by.id('changeButton'))
    })

    it('should be able to change password', () => {
      currentPassword.sendKeys('focusOnScienceMorty!focusOnScience')
      newPassword.sendKeys('GonorrheaCantSeeUs!')
      newPasswordRepeat.sendKeys('GonorrheaCantSeeUs!')
      changeButton.click()

      expect($('.confirmation').getAttribute('hidden')).not.toBeTruthy()
    })
  })

})
