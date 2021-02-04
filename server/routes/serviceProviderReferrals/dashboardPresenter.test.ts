import DashboardPresenter from './dashboardPresenter'
import serviceCategoryFactory from '../../../testutils/factories/serviceCategory'
import sentReferralFactory from '../../../testutils/factories/sentReferral'

describe(DashboardPresenter, () => {
  describe('tableHeadings', () => {
    it('returns the table’s headings', () => {
      const presenter = new DashboardPresenter([], [])

      expect(presenter.tableHeadings).toEqual(['Date received', 'Referral', 'Service user', 'Intervention type'])
    })
  })

  describe('tableRows', () => {
    it('returns the table’s rows', () => {
      const accommodationServiceCategory = serviceCategoryFactory.build({ name: 'accommodation' })
      const socialInclusionServiceCategory = serviceCategoryFactory.build({ name: 'social inclusion' })
      const sentReferrals = [
        sentReferralFactory.build({
          sentAt: '2021-01-26T13:00:00.000000Z',
          referenceNumber: 'ABCABCA1',
          referral: {
            serviceCategoryId: accommodationServiceCategory.id,
            serviceUser: { firstName: 'George', lastName: 'Michael' },
          },
        }),
        sentReferralFactory.build({
          sentAt: '2020-09-13T13:00:00.000000Z',
          referenceNumber: 'ABCABCA2',
          referral: {
            serviceCategoryId: socialInclusionServiceCategory.id,
            serviceUser: { firstName: 'Jenny', lastName: 'Jones' },
          },
        }),
      ]

      const presenter = new DashboardPresenter(sentReferrals, [
        accommodationServiceCategory,
        socialInclusionServiceCategory,
      ])

      expect(presenter.tableRows).toEqual([
        [
          { text: '26 Jan 2021', sortValue: '2021-01-26' },
          { text: 'ABCABCA1', sortValue: null },
          { text: 'George Michael', sortValue: 'michael, george' },
          { text: 'Accommodation', sortValue: null },
        ],
        [
          { text: '13 Sep 2020', sortValue: '2020-09-13' },
          { text: 'ABCABCA2', sortValue: null },
          { text: 'Jenny Jones', sortValue: 'jones, jenny' },
          { text: 'Social inclusion', sortValue: null },
        ],
      ])
    })
  })
})