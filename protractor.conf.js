'use strict'

var proxy = {
  proxyType: 'autodetect'
}

if (process.env.HTTP_PROXY !== undefined && process.env.HTTP_PROXY !== null) {
  proxy = {
    proxyType: 'manual',
    httpProxy: process.env.HTTP_PROXY
  }
}

if (process.env.BUILD_NUMBER == undefined) {
  exports.config = {
    directConnect: true,

    allScriptsTimeout: 80000,

    specs: [
      'test/e2e/*.js'
    ],

    capabilities: {
      // allows different specs to run in parallel.
      // If this is set to be true, specs will be sharded by file
      // (i.e. all files to be run by this set of capabilities will run in parallel).
      // Default is false.
      shardTestFiles: true,
       
      // Maximum number of browser instances that can run in parallel for this
      // set of capabilities. This is only needed if shardTestFiles is true.
      // Default is 1.
      maxInstances: 3,  
      browserName: 'chrome',
      proxy: proxy
    },

    baseUrl: 'http://localhost:3000',

    framework: 'jasmine2',

    jasmineNodeOpts: {
      showColors: true,
      defaultTimeoutInterval: 90000
    },

    onPrepare: function () {
      var jasmineReporters = require('jasmine-reporters')
      jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
        consolidateAll: true,
        savePath: 'build/reports/e2e_results'
      }))

      // Get cookie consent popup out of the way
      browser.get('/#')
      browser.manage().addCookie({ name: 'cookieconsent_status', value: 'dismiss' })
    }
  }
} else {
  exports.config = {
    directConnect: false,
    seleniumAddress: 'http://selenium:4444/wd/hub',
    allScriptsTimeout: 80000,
    specs: [
      'test/e2e/*.js',
      
    ],
    capabilities: {
      browserName: 'chrome',
      // allows different specs to run in parallel.
      // If this is set to be true, specs will be sharded by file
      // (i.e. all files to be run by this set of capabilities will run in parallel).
      // Default is false.
      shardTestFiles: true,
       
      // Maximum number of browser instances that can run in parallel for this
      // set of capabilities. This is only needed if shardTestFiles is true.
      // Default is 1.
      maxInstances: 3,  
      proxy: {
        proxyType: 'manual',
        httpProxy: 'http://zap:8888'
      }
    },
    baseUrl: 'http://juiceshop.com:3000',
    framework: 'jasmine2',
    jasmineNodeOpts: {
      showColors: true,
      defaultTimeoutInterval: 90000
    },
    onPrepare: function () {
      var jasmineReporters = require('jasmine-reporters')
      jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
        consolidateAll: true,
        savePath: 'build/reports/e2e_results'
      }))
      // Get cookie consent popup out of the way
      browser.get('/#')
      browser.manage().addCookie({ name: 'cookieconsent_status', value: 'dismiss' })
    }
  }
}

if (process.env.TRAVIS_BUILD_NUMBER) {
  exports.config.capabilities.chromeOptions = {
    args: ['--headless', '--disable-gpu', '--window-size=800,600']
  }
}
