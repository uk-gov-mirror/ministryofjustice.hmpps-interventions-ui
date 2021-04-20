import actionPlanAppointmentFactory from '../../../testutils/factories/actionPlanAppointment'
import deliusServiceUserFactory from '../../../testutils/factories/deliusServiceUser'
import SubmittedPostSessionFeedbackPresenter from './submittedPostSessionFeedbackPresenter'

describe(SubmittedPostSessionFeedbackPresenter, () => {
  describe('text', () => {
    it('includes the title of the page', () => {
      const appointment = actionPlanAppointmentFactory.build()
      const serviceUser = deliusServiceUserFactory.build()

      const presenter = new SubmittedPostSessionFeedbackPresenter(appointment, serviceUser)

      expect(presenter.text).toMatchObject({
        title: 'View feedback',
      })
    })
  })

  describe('serviceUserBannerPresenter', () => {
    it('is instantiated with the service user', () => {
      const appointment = actionPlanAppointmentFactory.build()
      const serviceUser = deliusServiceUserFactory.build()

      const presenter = new SubmittedPostSessionFeedbackPresenter(appointment, serviceUser)

      expect(presenter.serviceUserBannerPresenter).toBeDefined()
    })
  })
})
