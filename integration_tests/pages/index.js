const createPage = require('./page')

const createIndexPage = () =>
  createPage('This site is under construction...', {
    headerUserName: () => cy.get('[data-qa=header-user-name]'),
  })

module.exports = createIndexPage
