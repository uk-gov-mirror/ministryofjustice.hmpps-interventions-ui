import { DeliusServiceUser } from '../../services/communityApiService'
import { ActionPlanAppointment } from '../../services/interventionsService'
import FeedbackAnswersPresenter from './feedbackAnswersPresenter'
import ServiceUserBannerPresenter from './serviceUserBannerPresenter'

export default class SubmittedPostSessionFeedbackPresenter {
  readonly feedbackAnswersPresenter: FeedbackAnswersPresenter

  constructor(private readonly appointment: ActionPlanAppointment, private readonly serviceUser: DeliusServiceUser) {
    this.feedbackAnswersPresenter = new FeedbackAnswersPresenter(this.appointment, this.serviceUser)
  }

  readonly serviceUserBannerPresenter = new ServiceUserBannerPresenter(this.serviceUser)

  readonly text = {
    title: `View feedback`,
  }
}
