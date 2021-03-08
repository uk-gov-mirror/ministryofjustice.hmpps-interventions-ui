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
      },
    ]
  }

  private addActivityTextareaArgs = (index: number) => {
    const desiredOutcome = this.presenter.desiredOutcomes[index]!

    return {
      name: 'description',
      id: `description-${index + 1}`,
      label: {
        html: `<h4 class="govuk-heading-s">${ViewUtils.escape(
          `Activity ${desiredOutcome.activities.length + 1}`
        )}</h4>`,
      },
      hint: {
        text: 'What activity will you deliver to achieve this outcome?',
      },
    }
  }
}
