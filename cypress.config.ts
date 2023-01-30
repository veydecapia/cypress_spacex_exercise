import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/specs/*.spec.{js,jsx,ts,tsx}',
    chromeWebSecurity: false,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,
    // experimentalSessionAndOrigin: true,
    retries: {
      runMode: 2,
      openMode: 1
    },

    setupNodeEvents(on, config) {
      switch (process.env.ENVIRONMENT) {
        case 'prod':
          config.baseUrl = config.env.prod.baseUrl
          config.env.loginUrl = config.env.prod.accountsLoginUrl
          break;
        case 'dev':
          config.baseUrl = config.env.dev.baseUrl
          break;
        case 'test':
          config.baseUrl = config.env.test.baseUrl
          break;
        case 'local':
          config.baseUrl = config.env.local.baseUrl
          break;
        default:
          config.baseUrl = config.env.local.baseUrl
          break;
      }

      return config
    },

  }
})