Cypress.Commands.add('stubGetServiceUserByCRN', (crn, responseJson) => {
  cy.task('stubGetServiceUserByCRN', { crn, responseJson })
})

Cypress.Commands.add('stubGetUserByUsername', (username, responseJson) => {
  cy.task('stubGetUserByUsername', { username, responseJson })
})

Cypress.Commands.add('stubGetActiveConvictionsByCRN', (crn, responseJson) => {
  cy.task('stubGetActiveConvictionsByCRN', { crn, responseJson })
})
