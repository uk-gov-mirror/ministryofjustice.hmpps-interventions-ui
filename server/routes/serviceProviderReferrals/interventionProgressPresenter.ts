import { ActionPlan, ActionPlanAppointment, SentReferral, ServiceCategory } from '../../services/interventionsService'
import utils from '../../utils/utils'
import ReferralOverviewPagePresenter, { ReferralPageSection } from './referralOverviewPagePresenter'
import { DeliusServiceUser } from '../../services/communityApiService'
import { TableRows } from '../../utils/govukFrontendTypes'
import ViewUtils, { GovukColour } from '../../utils/viewUtils'

export default class InterventionProgressPresenter {
  referralOverviewPagePresenter: ReferralOverviewPagePresenter

  constructor(
    private readonly referral: SentReferral,
    private readonly serviceCategory: ServiceCategory,
    private readonly actionPlan: ActionPlan | null,
    serviceUser: DeliusServiceUser,
    private readonly actionPlanAppointments: ActionPlanAppointment[]
  ) {
    this.referralOverviewPagePresenter = new ReferralOverviewPagePresenter(
      ReferralPageSection.Progress,
      referral,
      serviceUser
    )
  }

  private notScheduledTag = ViewUtils.govukTag('NOT SCHEDULED', GovukColour.Grey)

  private scheduledTag = ViewUtils.govukTag('SCHEDULED', GovukColour.Blue)

  readonly createActionPlanFormAction = `/service-provider/referrals/${this.referral.id}/action-plan`

  readonly text = {
    title: utils.convertToTitleCase(this.serviceCategory.name),
    actionPlanStatus: this.actionPlanSubmitted ? 'Submitted' : 'Not submitted',
  }

  readonly actionPlanStatusStyle: 'active' | 'inactive' = this.actionPlanSubmitted ? 'active' : 'inactive'

  private get actionPlanSubmitted() {
    return this.actionPlan !== null && this.actionPlan.submittedAt !== null
  }

  readonly sessionTableHeaders = ['Session details', 'Date and time', 'Status', 'Action']

  get sessionTableRows(): TableRows {
    if (this.actionPlanAppointments.length === 0) {
      return []
    }

    return this.actionPlanAppointments.map(appointment => [
      { text: `Session ${appointment.sessionNumber}` },
      { text: appointment.appointmentTime || '' },
      { html: appointment.appointmentTime ? this.scheduledTag : this.notScheduledTag },
      {
        html: appointment.appointmentTime
          ? '<a class="govuk-link" href="#">Reschedule session</a>'
          : '<a class="govuk-link" href="#">Edit session details</a>',
      },
    ])
  }
}
