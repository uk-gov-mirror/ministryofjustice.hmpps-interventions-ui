import ViewUtils from '../../utils/viewUtils'
import AddActionPlanActivitiesPresenter from './addActionPlanActivitiesPresenter'

export default class AddActionPlanActivitiesView {
  constructor(private readonly presenter: AddActionPlanActivitiesPresenter) {}

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'serviceProviderReferrals/actionPlan/addActivities',
      {
        presenter: this.presenter,
        addActivityTextareaArgs: this.addActivityTextareaArgs,
        errorSummaryArgs: this.errorSummaryArgs,
      },
    ]
  }

  private readonly errorSummaryArgs = ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary)

  private addActivityTextareaArgs = (index: number, desiredOutcomeDescription: string) => {
    return {
      name: 'add-activity',
      id: `add-activity-desired-outcome-${index}`,
      label: {
        html: `<h3 class="govuk-heading-m">Desired Outcome ${index}</h3><p class="govuk-body-m">${desiredOutcomeDescription}</p>`,
        classes: 'govuk-label',
      },
      hint: {
        text: 'What activity will you deliver to achieve this outcome?',
      },
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.errorMessage),
    }
  }
}
