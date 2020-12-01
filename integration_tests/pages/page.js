function createPage(name, pageObject = {}) {
  const checkOnPage = () => cy.get('h1').contains(name)
  const logout = () => cy.get('[data-qa=logout]')

  return { ...pageObject, checkOnPage, logout }
}

module.exports = createPage
