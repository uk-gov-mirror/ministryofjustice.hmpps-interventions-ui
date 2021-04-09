import { DeliusServiceUser } from '../../services/communityApiService'
import { ActionPlanAppointment } from '../../services/interventionsService'
import { FormValidationError } from '../../utils/formValidationError'
import PresenterUtils from '../../utils/presenterUtils'
import ServiceUserBannerPresenter from '../shared/serviceUserBannerPresenter'

export default class PostSessionBehaviourFeedbackPresenter {
  constructor(
    private readonly appointment: ActionPlanAppointment,
    private readonly serviceUser: DeliusServiceUser,
    private readonly error: FormValidationError | null = null,
    private readonly userInputData: Record<string, unknown> | null = null
  ) {}

  private errorMessageForField(field: string): string | null {
    return PresenterUtils.errorMessage(this.error, field)
  }

  readonly errorSummary = PresenterUtils.errorSummary(this.error, {
    fieldOrder: ['behaviour-description', 'notify-probation-practitioner'],
  })

  readonly text = {
    title: `Add behaviour feedback`,
    behaviourDescription: {
      question: `Describe ${this.serviceUser.firstName}'s behaviour in this session`,
      hint: 'For example, consider how well-engaged they were and what their body language was like.',
      errorMessage: this.errorMessageForField('behaviour-description'),
    },
    notifyProbationPractitioner: {
      question: 'If you described poor behaviour, do you want to notify the probation practitioner?',
      explanation: 'If you select yes, the probation practitioner will be notified by email.',
      hint: 'Select one option',
      errorMessage: this.errorMessageForField('notify-probation-practitioner'),
    },
  }

  readonly serviceUserBannerPresenter = new ServiceUserBannerPresenter(this.serviceUser)

  private readonly utils = new PresenterUtils(this.userInputData)

  readonly fields = {
    behaviourDescriptionValue: new PresenterUtils(this.userInputData).stringValue(
      this.appointment.sessionFeedback?.behaviour?.behaviourDescription || null,
      'behaviour-description'
    ),
    notifyProbationPractitioner: this.utils.booleanValue(
      this.appointment.sessionFeedback?.behaviour?.notifyProbationPractitioner ?? null,
      'notify-probation-practitioner'
    ),
  }
}
