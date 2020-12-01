const ReferralStartPage = require('../pages/referralStartPage')

context('Referrals', () => {
  test('User creates a referral', () => {
    cy.visit('/referrals/start')
    ReferralStartPage.verifyOnPage()
  })
})
