const { defineConfig } = require("cypress");
const { downloadFile } = require("cypress-downloadfile/lib/addPlugin");
const { sqlQueryPlugin } = require("cypress-multiple-db-sql-server");
const { lighthouse, prepareAudit } = require("@cypress-audit/lighthouse");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const preprocessor = require("@badeball/cypress-cucumber-preprocessor");
const createEsbuildPlugin = require("@badeball/cypress-cucumber-preprocessor/esbuild");
const allureWriter = require("@shelex/cypress-allure-plugin/writer");

module.exports = defineConfig({

  // reporter: 'mocha-junit-reporter',
  //reporterOptions: {
  //  mochafile: 'cypress/reports/junitreport-[hash].xml',
  //toConsole: true
  //},

  /*reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {

    reportDir: 'test-report',
    overwrite: false,
    saveJson: true,
    saveHtml: true,

    reportFilename: 'cypressreport',
    timestamp: 'yyyy_mm_dd_hh_MM',


    charts: true,
    reportPageTitle: 'custom-title',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },*/

  
  reporterEnabled: 'cypress-mochawesome-reporter, mocha-junit-reporter',
  reporterOptions: {
    reporter: 'cypress-multi-reporters',
    mochawesomeReporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: false,
      saveJson: true,
      saveHtml: true,

      reportFilename: 'cypressreports',
      timestamp: 'yyyy_mm_dd_hh_MM',
      charts: true,
      reportPageTitle: 'custom-title',
      embeddedScreenshots: true,
      inlineAssets: true,
      saveAllAttempts: false,
    },

    mochaJunitReporterReporterOptions: {
      mochafile: 'cypress/reports/junitreport-[hash].xml',
      toConsole: true
    }
  },

  chromeWebSecurity: false,
  defaultCommandTimeout: 10000,
  taskTimeout: 80000,
  pageLoadTimeout: 150000,

  env: {
    appUrl: 'https://www.amazon.in',
    titlekeyword: "Online",
    db: {
      authentication: {
        type: 'default',
        options: {
          userName: 'sa',
          password: 'sqladmin@123'
        }
      },
      server: '172.16.0.56',
      options: {
        database: '',
        encrypt: true,
        rowCollectionOnRequestCompletion: true,
        trustServerCertificate: true,
        port: 1433, // Default Port
      }
    }
  },
  e2e: {
    specPattern: ["cypress/e2e/features/*.feature", "cypress/e2e/*.cy.js"],
    env: {
      allureReuseAfterSpec: true,
    },
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      on('task', { downloadFile })
      on('task', { ...sqlQueryPlugin });
      // implement node event listeners here
      on("before:browser:launch", (browser = {}, launchOptions) => {
        prepareAudit(launchOptions);
      });

      on("task", {
        lighthouse: lighthouse(),

      });
      preprocessor.addCucumberPreprocessorPlugin(on, config);

      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin.default(config)],
        })
      );
      allureWriter(on, config);
      return config
    },
  },
});

